import { supabase } from '@/lib/supabase';
const FLASK_URL = process.env.EXPO_PUBLIC_FLASK_URL;

export interface TagFrequency {
  tag_id: string;
  name: string;
  count: number;
}

export interface BoardContents {
  stickers: number;
  photos: number;
  notes: number;
  templates: number;
}

export interface MonthlyCardData {
  month: number;
  created: number;
}

export interface ProfileStats {
  entries: number;
  friends: number;
  folders: number;
}

export interface Persona {
  title: string;
  bio: string;
  emoji: string;
}

export async function getUserProfile(
  userId: string
): Promise<{ data: { username: string; avatar_url: string | null } | null; error: any }> {
  const { data, error } = await supabase
    .from('profiles')
    .select('username, avatar_url')
    .eq('id', userId)
    .single();

  if (error || !data) return { data: null, error };
  return { data, error: null };
}

export async function getMostFrequentTags(
  userId: string,
  limit = 5
): Promise<{ data: TagFrequency[] | null; error: any }> {

  const { data, error } = await supabase
    .from('card_tags')
    .select('tag_id, tags(name), cards!inner(user_id)')
    .eq('cards.user_id', userId);

  if (error || !data) return { data: null, error };

  const countMap = new Map<string, { name: string; count: number }>(); // counts per tag_id with tag name

  for (const row of data as any[]) { // iterating through row 
    const id = row.tag_id;
    const name = row.tags?.name ?? 'Unknown';
    if (countMap.has(id)) {
      countMap.get(id)!.count += 1; // second occurence + more !
    } else {
      countMap.set(id, { name, count: 1 }); // first occurence 
    }
  }

  const sorted: TagFrequency[] = Array.from(countMap.entries())
    .map(([tag_id, { name, count }]) => ({ tag_id, name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);

  return { data: sorted, error: null };
}

export async function getCardsByMonth(
  userId: string,
  year: number = new Date().getFullYear()
): Promise<{ data: MonthlyCardData[] | null; error: any }> {

  const { data, error } = await supabase
    .from('cards')
    .select('created_at')
    .eq('user_id', userId)
    .gte('created_at', `${year}-01-01`)
    .lte('created_at', `${year}-12-31`);

  if (error || !data) return { data: null, error };

  const monthCounts = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    created: 0,
  }));

  for (const row of data as any[]) {
    const month = new Date(row.created_at).getMonth();
    monthCounts[month].created += 1;
  }

  return { data: monthCounts, error: null };
}

export async function getProfileStats(
  userId: string
): Promise<{ data: ProfileStats | null; error: any }> {

  const [entriesRes, friendsRes, foldersRes] = await Promise.all([
    supabase
      .from('cards')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId),

    supabase
      .from('friendships')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'accepted')
      .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`),

    supabase
      .from('folders')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId),
  ]);

  const error = entriesRes.error || friendsRes.error || foldersRes.error;
  if (error) return { data: null, error };

  return {
    data: {
      entries: entriesRes.count ?? 0,
      friends: friendsRes.count ?? 0,
      folders: foldersRes.count ?? 0,
    },
    error: null,
  };
}

export async function getBoardContents(
  userId: string
): Promise<{ data: BoardContents | null; error: any }> {

  const { data: folders } = await supabase
    .from('folders')
    .select('id')
    .eq('user_id', userId);

  const folderIds = (folders ?? []).map((f: any) => f.id);

  if (folderIds.length === 0) {
    return { data: { stickers: 0, photos: 0, notes: 0, templates: 0 }, error: null };
  }

  const [stickersRes, photosRes, notesRes] = await Promise.all([
    supabase
      .from('folder_stickers')
      .select('id', { count: 'exact', head: true })
      .in('folder_id', folderIds),

    supabase
      .from('board_photos')
      .select('id', { count: 'exact', head: true })
      .in('folder_id', folderIds),

    supabase
      .from('notes')
      .select('id', { count: 'exact', head: true })
      .in('folder_id', folderIds),

  ]);

  const error = stickersRes.error || photosRes.error || notesRes.error;
  if (error) return { data: null, error };

  return {
    data: {
      stickers: stickersRes.count ?? 0,
      photos: photosRes.count ?? 0,
      notes: notesRes.count ?? 0,
      templates: 0,
    },
    error: null,
  };
}

export async function getUserPersona(
  topTags: TagFrequency[],
  boardContents: BoardContents,
  cardsByMonth: MonthlyCardData[]
): Promise<{ data: Persona | null; error: any }> {

  const totalCards = cardsByMonth.reduce((sum, m) => sum + m.created, 0);
  const busiestMonth = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][
    cardsByMonth.reduce((maxIdx, m, i, arr) => m.created > arr[maxIdx].created ? i : maxIdx, 0)
  ];

  const prompt = `
You are analyzing a memory/scrapbook app user's activity. Based on their data, give them a creative persona.

Their data:
- Top tags: ${topTags.map(t => t.name).join(', ') || 'none yet'}
- Board contents: ${boardContents.photos} photos, ${boardContents.stickers} stickers, ${boardContents.notes} notes, ${boardContents.templates} templates
- Total cards created this year: ${totalCards}
- Most active month: ${busiestMonth}

Respond ONLY with a JSON object, no markdown, no explanation:
{
  "title": "short 3-4 word creative persona title",
  "bio": "1-2 sentence description of this person's style",
  "emoji": "single emoji that fits their vibe"
}
  `.trim();

  try {
   
  const response = await fetch(`${FLASK_URL}/persona`, { // flask url
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ prompt }),
});

const { raw } = await response.json();
const parsed: Persona = JSON.parse(raw);

return { data: parsed, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}