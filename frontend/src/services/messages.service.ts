// @/services/messages.service.ts
import { supabase } from '@/lib/supabase'; 

// ─── Conversations (used by messages.tsx) ─────────────────────────────────────

// Gets the latest message per conversation for the messages list screen
export async function getConversations(userId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      conversation_id,
      content,
      sender_id,
      created_at,
      unread,
      profiles:sender_id (
        id,
        username,
        avatar_url
      )
    `)
    .order('created_at', { ascending: false });

  if (error) return { data: null, error };

  // Keep only the latest message per conversation_id
  const seen = new Set<string>();
  const latest = data.filter((msg: any) => {
    if (seen.has(msg.conversation_id)) return false;
    seen.add(msg.conversation_id);
    return true;
  });

  return { data: latest, error: null };
}

// Zeros out unread count when user opens a conversation
export async function markConversationAsRead(conversationId: string, userId: string) {
  return await supabase
    .from('messages')
    .update({ unread: 0 })
    .eq('conversation_id', conversationId)
    .neq('sender_id', userId);
}

// ─── Chat room (used by chatRoom.tsx) ─────────────────────────────────────────

// Gets the other participant's profile from conversation_participants
export async function getConversationPartner(conversationId: string, currentUserId: string) {
  const { data, error } = await supabase
    .from('conversation_participants')
    .select(`
      user_id,
      profiles:user_id (
        username,
        avatar_url
      )
    `)
    .eq('conversation_id', conversationId)
    .neq('user_id', currentUserId)
    .single();

  if (error) return { data: null, error };
  return { data, error: null };
}

// Gets all messages for a conversation, oldest first, joining custom_cards for card messages
export async function getMessages(conversationId: string) {
  return await supabase
    .from('messages')
    .select(`
      id,
      content,
      sender_id,
      created_at,
      shared_folder_id,
      shared_card_id,
      custom_cards:shared_card_id (
        id,
        card_color,
        card_items
      )
    `)
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
}

// Inserts a new text message into the messages table
export async function sendMessage(conversationId: string, senderId: string, content: string) {
  return await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content,
      unread: 1,
    });
}

// Inserts a new custom card then sends it as a message
export async function sendCardMessage(
  conversationId: string,
  senderId: string,
  cardColor: string,
  cardItems: string
) {
  // Step 1: insert into custom_cards — both fields are text, no JSON.parse needed
  const { data: card, error: cardError } = await supabase
    .from('custom_cards')
    .insert({
      card_color: cardColor,
      card_items: cardItems,  // stored as text string
      created_by: senderId,
    })
    .select('id')
    .single();

  if (cardError || !card) {
    console.error('Error inserting custom card:', cardError);
    return { data: null, error: cardError };
  }

  // Step 2: insert message with shared_card_id pointing to the new card
  return await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content: '',
      shared_card_id: card.id,
      unread: 1,
    });
}

// Pins a custom card to the user's bulletin board
export async function pinCardToBoard(userId: string, cardId: string, folderId: string) {
  return await supabase
    .from('board_custom_cards')
    .insert({
      folder_id: folderId,
      card_id: cardId,
    });
}

export async function getContacts(userId: string) {
  // get all conversation_ids the current user is part of
  const { data: myConvos, error: convosError } = await supabase
    .from('conversation_participants')
    .select('conversation_id')
    .eq('user_id', userId);

  if (convosError || !myConvos) return { data: null, error: convosError };

  const conversationIds = myConvos.map((c: any) => c.conversation_id);
  if (conversationIds.length === 0) return { data: [], error: null };

  // get the other participants in those conversations (not the current user)
  const { data, error } = await supabase
    .from('conversation_participants')
    .select('conversation_id, user_id, profiles(username, avatar_url)')
    .in('conversation_id', conversationIds)
    .neq('user_id', userId); // exclude current user

  if (error || !data) return { data: null, error };

  const contacts = (data as any[]).map(row => ({
    conversationId: row.conversation_id,
    userId: row.user_id,
    name: row.profiles?.username ?? 'Unknown',
    avatarUrl: row.profiles?.avatar_url ?? null,
  }));

  return { data: contacts, error: null };
}