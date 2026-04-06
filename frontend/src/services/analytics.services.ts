import { supabase } from '@/lib/supabase';

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

export async function getMostFrequentTags(
  userId: string,
  limit = 5
): Promise<{ data: TagFrequency[] | null; error: any }> {

  // Go to the card_tags table, find all rows where user_id matches,
  // and also pull in the tag name from the tags table via the foreign key
  const { data, error } = await supabase
    .from('card_tags')
    .select('tag_id, tags(name)') // gets the tag id, also the name of the tag
    .eq('user_id', userId); // if user_id == user, so current user 

  if (error || !data) return { data: null, error }; // error catching for tags

  // At this point data looks like:
  // [
  //   { tag_id: 'abc', tags: { name: 'family' } },
  //   { tag_id: 'abc', tags: { name: 'family' } },
  //   { tag_id: 'xyz', tags: { name: 'birthday' } },
  // ]
  // So we count how many times each tag_id appears

  const countMap = new Map<string, { name: string; count: number }>();

  for (const row of data as any[]) {
    const id = row.tag_id;
    const name = row.tags?.name ?? 'Unknown'; 
    if (countMap.has(id)) {
      countMap.get(id)!.count += 1;  // seen this tag before, increment
    } else {
      countMap.set(id, { name, count: 1 });  // first time seeing this tag
    }
  }

  // Sort highest count first, take top N
  const sorted: TagFrequency[] = Array.from(countMap.entries()) 
    .map(([tag_id, { name, count }]) => ({ tag_id, name, count })) // maps tag id to the interface variables
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);

  return { data: sorted, error: null }; 
}

export async function getBoardContents(
  userId: string
): Promise<{ data: BoardContents | null; error: any }> {

  // Run all four counts in parallel
  const [stickersRes, photosRes, notesRes, templatesRes] = await Promise.all([

    // Stickers — has user_id directly
    supabase
      .from('stickers')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId),

    // Photos — card_images has no user_id, join through cards
    supabase
      .from('board_photos')
      .select('id, cards!inner(user_id)', { count: 'exact', head: true })
      .eq('cards.user_id', userId),

    // Notes — has user_id directly
    supabase
      .from('notes')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId),

    // Templates — now has user_id
    supabase
      .from('templates')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId),
  ]);

  // If any query errored, return the first error
  const error = stickersRes.error || photosRes.error || notesRes.error || templatesRes.error;
  if (error) return { data: null, error };

  return {
    data: {
      stickers: stickersRes.count ?? 0,
      photos: photosRes.count ?? 0,
      notes: notesRes.count ?? 0,
      templates: templatesRes.count ?? 0,
    },
    error: null,
  };
}
