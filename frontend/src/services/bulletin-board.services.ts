import { supabase } from '@/lib/supabase';

type ItemFields = { x?: number; y?: number; rotation?: number; scale?: number };

const TABLE_MAP: Record<string, string> = {
  note: 'notes',
  card: 'cards',
  gif: 'board_gifs',
  photo: 'board_photos',
  custom_card: 'board_custom_cards',
  sticker: 'folder_stickers',
};

export async function fetchBoardItems(folderId: string) {
  const [
    { data: cards },
    { data: notes },
    { data: stickers },
    { data: gifs },
    { data: photos },
    { data: customCards },
  ] = await Promise.all([
    supabase.from('cards').select('*, card_images(image_url, order_index)').eq('folder_id', folderId),
    supabase.from('notes').select('*').eq('folder_id', folderId),
    supabase.from('folder_stickers').select('*, stickers(*)').eq('folder_id', folderId),
    supabase.from('board_gifs').select('*').eq('folder_id', folderId),
    supabase.from('board_photos').select('*').eq('folder_id', folderId),
    supabase.from('board_custom_cards').select('*, custom_cards(card_color, card_items)').eq('folder_id', folderId),
  ]);

  return [
    ...(cards || []).map((c: any) => {
      const sortedImages = (c.card_images || []).sort((a: any, b: any) => a.order_index - b.order_index);
      return { id: c.id, type: 'card' as const, content: c.title, x: c.x, y: c.y, rotation: c.rotation, scale: c.scale, image: sortedImages[0] ? { uri: sortedImages[0].image_url } : null };
    }),
    ...(notes || []).map((n: any) => ({ id: n.id, type: 'note' as const, content: n.content, x: n.x, y: n.y, rotation: n.rotation, scale: n.scale, color: n.color })),
    ...(stickers || []).map((fs: any) => ({ id: fs.id, type: 'sticker' as const, content: '', x: fs.x, y: fs.y, rotation: fs.rotation, scale: fs.scale, sticker: fs.stickers.image_url })),
    ...(gifs || []).map((g: any) => ({ id: g.id, type: 'gif' as const, content: '', x: g.x, y: g.y, rotation: g.rotation, scale: g.scale, sticker: g.giphy_url })),
    ...(photos || []).map((p: any) => ({ id: p.id, type: 'photo' as const, content: '', x: p.x, y: p.y, rotation: p.rotation, scale: p.scale, sticker: p.image_url })),
    ...(customCards || []).map((bc: any) => ({ id: bc.id, type: 'custom_card' as const, content: '', x: bc.x, y: bc.y, rotation: bc.rotation, scale: bc.scale, cardColor: bc.custom_cards?.card_color, cardItems: bc.custom_cards?.card_items })),
  ];
}

// Fetches all available stickers from Supabase
export async function fetchStickers() {
  const { data, error } = await supabase.from('stickers').select('id, name, image_url');
  if (error) throw error;
  return data as { id: string; name: string; image_url: string }[];
}

export async function updateItemPosition(itemType: string, id: string, fields: ItemFields) {
  const table = TABLE_MAP[itemType];
  if (!table) return;
  const { error } = await supabase.from(table).update(fields).eq('id', id);
  if (error) console.error('updateItemPosition error:', error);
}

export async function deleteItem(itemType: string, id: string) {
  const table = TABLE_MAP[itemType];
  if (!table) return;
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
}

export async function addNote(folderId: string, color: string) {
  const { data, error } = await supabase.from('notes')
    .insert({ folder_id: folderId, content: 'New note', color, x: 80, y: 100, rotation: 0, scale: 1 })
    .select().single();
  if (error) throw error;
  return { ...data, type: 'note' as const };
}

// Takes stickerId directly — no need to look up by name anymore
export async function addSticker(folderId: string, stickerId: string) {
  const { data, error } = await supabase.from('folder_stickers')
    .insert({ folder_id: folderId, sticker_id: stickerId, x: 150, y: 200, rotation: 0, scale: 1 })
    .select('*, stickers(*)').single();
  if (error) throw error;
  return { id: data.id, type: 'sticker' as const, content: '', x: data.x, y: data.y, rotation: data.rotation, scale: data.scale, sticker: data.stickers.image_url };
}

export async function addGif(folderId: string, gifUrl: string) {
  const { data, error } = await supabase.from('board_gifs')
    .insert({ folder_id: folderId, giphy_url: gifUrl, x: 100, y: 150, rotation: 0, scale: 1 })
    .select().single();
  if (error) throw error;
  return { id: data.id, type: 'gif' as const, content: '', x: data.x, y: data.y, rotation: data.rotation, scale: data.scale, sticker: data.giphy_url };
}

export async function addPhoto(folderId: string, uri: string) {
  const fileName = `${folderId}/${Date.now()}.jpg`;
  const response = await fetch(uri);
  const blob = await response.blob();

  const { error: uploadError } = await supabase.storage.from('board-photos').upload(fileName, blob, { contentType: 'image/jpeg' });
  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage.from('board-photos').getPublicUrl(fileName);

  const { data, error } = await supabase.from('board_photos')
    .insert({ folder_id: folderId, image_url: publicUrl, x: 100, y: 150, rotation: 0, scale: 1 })
    .select().single();
  if (error) throw error;
  return { id: data.id, type: 'photo' as const, content: '', x: data.x, y: data.y, rotation: data.rotation, scale: data.scale, sticker: data.image_url };
}

export async function pinCustomCard(cardId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No user');

  const { data: board, error: boardError } = await supabase.from('bulletin_board').select('id').eq('user_id', user.id).single();
  if (boardError || !board) throw new Error('No bulletin board found');

  const { data, error } = await supabase.from('board_custom_cards')
    .insert({ folder_id: board.id, card_id: cardId, x: 100, y: 150, rotation: 0, scale: 1 })
    .select().single();
  if (error) throw error;

  return { id: data.id, type: 'custom_card' as const, content: '', x: data.x, y: data.y, rotation: data.rotation, scale: data.scale, cardId: data.card_id };
}

export async function updateNoteContent(id: string, content: string) {
  const { error } = await supabase
    .from('notes')
    .update({ content })
    .eq('id', id);
  if (error) throw error;
}
export async function addMusic(
  folderId: string,
  spotifyUrl: string,
  trackName: string,
  artistName: string,
  albumImageUrl: string
) {
  const { data, error } = await supabase
    .from("board_music")
    .insert({
      folder_id: folderId,
      spotify_url: spotifyUrl,
      track_name: trackName,
      artist_name: artistName,
      album_image_url: albumImageUrl,
      x: 100,
      y: 150,
      rotation: 0,
      scale: 1,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    type: "music" as const,
    content: data.track_name,
    x: data.x,
    y: data.y,
    rotation: data.rotation,
    scale: data.scale,
    sticker: data.album_image_url,
    spotifyUrl: data.spotify_url,
    artistName: data.artist_name,
  };
}