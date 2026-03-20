import { supabase } from '@/lib/supabase'

// CREATE - send a friend request
export async function sendFriendRequest(requesterId: string, receiverEmail: string) {
  // Step 1 - find the receiver by email
  const { data: receiver, error: receiverError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', receiverEmail)
    .single()

  if (receiverError || !receiver) {
    return { data: null, error: { message: 'User not found' } }
  }

  // Step 2 - send friend request
  const { data, error } = await supabase
    .from('friendships')
    .insert({
      requester_id: requesterId,
      receiver_id: receiver.id,
      status: 'pending'
    })
    .select()
    .single()

  return { data, error }
}

// READ - get all friendships for a user
export async function getFriendships(userId: string) {
  const { data, error } = await supabase
    .from('friendships')
    .select('*, requester:profiles!requester_id(*), receiver:profiles!receiver_id(*)')
    .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`)
    .eq('status', 'accepted')
  return { data, error }
}

// READ - get all pending friend requests
export async function getPendingRequests(userId: string) {
  const { data, error } = await supabase
    .from('friendships')
    .select('*, requester:profiles!requester_id(*)')
    .eq('receiver_id', userId)
    .eq('status', 'pending')
  return { data, error }
}

// UPDATE - accept a friend request
export async function acceptFriendRequest(friendshipId: string) {
  const { data, error } = await supabase
    .from('friendships')
    .update({ status: 'accepted' })
    .eq('id', friendshipId)
    .select()
    .single()
  return { data, error }
}

// UPDATE - decline a friend request
export async function declineFriendRequest(friendshipId: string) {
  const { data, error } = await supabase
    .from('friendships')
    .update({ status: 'declined' })
    .eq('id', friendshipId)
    .select()
    .single()
  return { data, error }
}

// DELETE - remove a friend
export async function removeFriend(friendshipId: string) {
  const { data, error } = await supabase
    .from('friendships')
    .delete()
    .eq('id', friendshipId)
  return { data, error }
}