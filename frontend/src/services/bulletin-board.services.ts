import { supabase } from '@/lib/supabase';

export async function fetchBoardItems(folderId: string) {
  const [
    { data: cards },
    { data: notes },
    { data: stickers },
    { data: gifs },
    { data: photos },
    { data: customCards },
  ] = await Promise.all([
    supabase.from('cards').select('*').eq('folder_id', folderId),
    supabase.from('notes').select('*').eq('folder_id', folderId),
    supabase.from('folder_stickers').select('*, stickers(*)').eq('folder_id', folderId),
    supabase.from('board_gifs').select('*').eq('folder_id', folderId),
    supabase.from('board_photos').select('*').eq('folder_id', folderId),
    supabase.from('board_custom_cards')
      .select('*, custom_cards(card_color, card_items)')
      .eq('folder_id', folderId),
  ]);

  return [
    ...(cards || []).map((c) => ({
      id: c.id,
      type: 'card' as const,
      content: c.content,
      x: c.x, y: c.y,
      rotation: c.rotation,
      scale: c.scale,
      image: { uri: c.image_url },
    })),
    ...(notes || []).map((n) => ({
      id: n.id,
      type: 'note' as const,
      content: n.content,
      x: n.x, y: n.y,
      rotation: n.rotation,
      scale: n.scale,
      color: n.color,
    })),
    ...(stickers || []).map((fs) => ({
      id: fs.id,
      type: 'sticker' as const,
      content: '',
      x: fs.x, y: fs.y,
      rotation: fs.rotation,
      scale: fs.scale,
      sticker: fs.stickers.image_url,
    })),
    ...(gifs || []).map((g) => ({
      id: g.id,
      type: 'gif' as const,
      content: '',
      x: g.x, y: g.y,
      rotation: g.rotation,
      scale: g.scale,
      sticker: g.giphy_url,
    })),
    ...(photos || []).map((p) => ({
      id: p.id,
      type: 'photo' as const,
      content: '',
      x: p.x, y: p.y,
      rotation: p.rotation,
      scale: p.scale,
      sticker: p.image_url,
    })),
    ...(customCards || []).map((bc) => ({
      id: bc.id,
      type: 'custom_card' as const,
      content: '',
      x: bc.x, y: bc.y,
      rotation: bc.rotation,
      scale: bc.scale,
      cardColor: bc.custom_cards?.card_color,
      cardItems: bc.custom_cards?.card_items,
    })),
  ];
}

export async function pinCustomCard(cardId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No user');

  const { data: board, error: boardError } = await supabase
    .from('bulletin_board')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (boardError || !board) throw new Error('No bulletin board found');

  const { data, error } = await supabase
    .from('board_custom_cards')
    .insert({
      folder_id: board.id,
      card_id: cardId,
      x: 100, y: 150,
      rotation: 0, scale: 1,
    })
    .select()
    .single();

  if (error) throw error;
  return {
    id: data.id,
    type: 'custom_card' as const,
    content: '',
    x: data.x, y: data.y,
    rotation: data.rotation,
    scale: data.scale,
    cardId: data.card_id,
  };
}

export async function addNote(folderId: string, color: string) {
  const { data, error } = await supabase
    .from('notes')
    .insert({
      folder_id: folderId,
      content: 'New note',
      color,
      x: 80, y: 100,
      rotation: 0, scale: 1,
    })
    .select()
    .single();

  if (error) throw error;
  return { ...data, type: 'note' as const };
}

export async function addSticker(folderId: string, stickerKey: string) {
  const { data: sticker, error: stickerError } = await supabase
    .from('stickers')
    .select('*')
    .eq('key', stickerKey)
    .single();

  if (stickerError) throw stickerError;

  const { data, error } = await supabase
    .from('folder_stickers')
    .insert({
      folder_id: folderId,
      sticker_id: sticker.id,
      x: 150, y: 200,
      rotation: 0, scale: 1,
    })
    .select('*, stickers(*)')
    .single();

  if (error) throw error;
  return {
    id: data.id,
    type: 'sticker' as const,
    content: '',
    x: data.x, y: data.y,
    rotation: data.rotation,
    scale: data.scale,
    sticker: data.stickers.image_url,
  };
}

export async function addGif(folderId: string, gifUrl: string) {
  const { data, error } = await supabase
    .from('board_gifs')
    .insert({
      folder_id: folderId,
      giphy_url: gifUrl,
      x: 100, y: 150,
      rotation: 0, scale: 1,
    })
    .select()
    .single();

  if (error) throw error;
  return {
    id: data.id,
    type: 'gif' as const,
    content: '',
    x: data.x, y: data.y,
    rotation: data.rotation,
    scale: data.scale,
    sticker: data.giphy_url,
  };
}

export async function addPhoto(folderId: string, uri: string) {
  const fileName = `${folderId}/${Date.now()}.jpg`;
  const response = await fetch(uri);
  const blob = await response.blob();

  const { error: uploadError } = await supabase.storage
    .from('board-photos')
    .upload(fileName, blob, { contentType: 'image/jpeg' });

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('board-photos')
    .getPublicUrl(fileName);

  const { data, error } = await supabase
    .from('board_photos')
    .insert({
      folder_id: folderId,
      image_url: publicUrl,
      x: 100, y: 150,
      rotation: 0, scale: 1,
    })
    .select()
    .single();

  if (error) throw error;
  return {
    id: data.id,
    type: 'photo' as const,
    content: '',
    x: data.x, y: data.y,
    rotation: data.rotation,
    scale: data.scale,
    sticker: data.image_url,
  };
}

export async function updateItemPosition(
  itemType: 'note' | 'card' | 'sticker' | 'gif' | 'photo' | 'custom_card' | string,
  id: string,
  fields: { x?: number; y?: number; rotation?: number; scale?: number }
) {
  const table =
    itemType === 'note' ? 'notes' :
    itemType === 'card' ? 'cards' :
    itemType === 'gif' ? 'board_gifs' :
    itemType === 'photo' ? 'board_photos' :
    itemType === 'custom_card' ? 'board_custom_cards' :
    'folder_stickers';

  const { error } = await supabase.from(table).update(fields).eq('id', id);
  if (error) throw error;
}

export async function deleteItem(itemType: string, id: string) {
  const table =
    itemType === 'note' ? 'notes' :
    itemType === 'card' ? 'cards' :
    itemType === 'gif' ? 'board_gifs' :
    itemType === 'photo' ? 'board_photos' :
    itemType === 'custom_card' ? 'board_custom_cards' :
    'folder_stickers';

  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
}

export async function updateNoteContent(id: string, content: string) {
  const { error } = await supabase
    .from('notes')
    .update({ content })
    .eq('id', id);
  if (error) throw error;
}