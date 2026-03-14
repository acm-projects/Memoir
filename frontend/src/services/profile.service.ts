import { supabase } from '@/lib/supabase'

// READ - get a single profile by user id
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return { data, error }
}

// UPDATE - update a user's profile
export async function updateProfile(userId: string, updates: {
  username?: string
  full_name?: string
  avatar_url?: string
  website?: string
}) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
  return { data, error }
}

// READ - get all avatars for avatar selection screen
export async function getAvatars() {
  const { data, error } = await supabase
    .from('avatars')
    .select('*')
  return { data, error }
}
// ## Why No CREATE or DELETE?
// CREATE → handled by trigger automatically when user signs up
// DELETE → handled by Supabase Auth when user deletes account