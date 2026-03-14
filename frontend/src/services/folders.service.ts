import { supabase } from '@/lib/supabase'

// CREATE - create a new folder
export async function createFolder(userId: string, folder: {
  name: string
  description?: string
  cover_image_url?: string
  event_date?: string
  is_default?: boolean
}) {
  const { data, error } = await supabase
    .from('folders')
    .insert({ ...folder, user_id: userId })
    .select()
    .single()
  return { data, error }
}

// READ - get all folders for a user
export async function getFolders(userId: string) {
  const { data, error } = await supabase
    .from('folders')
    .select('*')
    .eq('user_id', userId)
    .order('event_date', { ascending: true })
  return { data, error }
}

// READ - get a single folder by id
export async function getFolderById(folderId: string) {
  const { data, error } = await supabase
    .from('folders')
    .select('*')
    .eq('id', folderId)
    .single()
  return { data, error }
}

// UPDATE - update a folder
export async function updateFolder(folderId: string, updates: {
  name?: string
  description?: string
  cover_image_url?: string
  event_date?: string
}) {
  const { data, error } = await supabase
    .from('folders')
    .update(updates)
    .eq('id', folderId)
    .select()
    .single()
  return { data, error }
}

// DELETE - delete a folder
export async function deleteFolder(folderId: string) {
  const { data, error } = await supabase
    .from('folders')
    .delete()
    .eq('id', folderId)
  return { data, error }
}

// CREATE - auto create default "All Memories" folder for new user
export async function createDefaultFolder(userId: string) {
  const { data, error } = await supabase
    .from('folders')
    .insert({
      user_id: userId,
      name: 'All Memories',
      is_default: true,
      description: 'All your memories in one place'
    })
    .select()
    .single()
  return { data, error }
}

// createFolder()
// Creates a new folder. Spreads the folder object and adds user_id automatically.
// getFolders()
// Gets all folders for a user ordered by event_date ascending — this is what powers the Timeline screen showing folders in chronological order.
// getFolderById()
// Gets one specific folder — used when user clicks on a folder to open it.
// updateFolder()
// Updates folder details — used when user edits folder name, description etc.
// deleteFolder()
// Deletes a folder. Because of ON DELETE CASCADE in the database, all cards and stickers in that folder are automatically deleted too.
// createDefaultFolder()
// Special function to create the "All Memories" folder. This gets called right after a user signs up — we'll hook this into the signup flow later.