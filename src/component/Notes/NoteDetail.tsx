import React, { useEffect, useState } from 'react';
import { Archive, Calendar, FileText, FolderIcon, Star, Trash } from 'lucide-react';
import { useApp } from '../../Context/useApp';
import type { Note as NoteType } from '../../Context/AppContext';
import { getNotesDetail } from '../../Api/Api';
import NoteForm from './NoteForm';

type Props = {
  onClose: () => void;
}

const NoteDetail: React.FC<Props> = () => {
  const { activeNoteId, activeFolderName, setActiveNoteId } = useApp();
  const [note, setNote] = useState<NoteType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [menuOpen, setMenuOpen] = useState<boolean>(false);


  useEffect(() => {
    if (!activeNoteId || activeNoteId === "new") {
      setNote(null);
      return;
    }



    const fetchNotesDetails = async () => {
      try {
        setLoading(true);
        const data = await getNotesDetail(activeNoteId);

        setNote(data);
      } catch (err) {
        console.log(err);
        setNote(null);
      } finally {
        setLoading(false);
      }
    };
    fetchNotesDetails();
  }, [activeNoteId]);

  if (activeNoteId == "new") {
    return <NoteForm onClose={() => setActiveNoteId(null)} />
  }


  if (!activeNoteId) {
    return <div className='flex flex-col justify-center items-center pl-65'>

      <FileText className='text-(--add-bg) w-20 h-20' />
      <p style={{ fontFamily: 'var(--font-primary)' }}
        className="text-white text-3xl font-semibold p-4">Select a note to view</p>
      <p style={{ fontFamily: 'var(--font-primary)' }}
        className='text-base text-(--text-bg)'>Choose a note from the list on the left to view its contents, or create a </p>
      <p style={{ fontFamily: 'var(--font-primary)' }}
        className='text-base text-(--text-bg)'>new note to add to your collection.</p>
    </div>;
  }

  if (loading) return <p className="text-(--text-bg) p-4">Loading...</p>;
  if (!note) return <p className="text-(--text-bg) p-4">No note found</p>;

  return (
    <div className="h-full w-250 px-8 py-5 overflow-y-auto ">
      <div className='flex items-center justify-between'>
        <h2
          style={{ fontFamily: 'var(--font-primary)', fontStyle: 'var(--font-semibold)' }}
          className="text-(--add-bg) text-3xl"
        >
          {note.title}
        </h2>
        <button onClick={() => setMenuOpen(true)}
          className="w-6 h-6 flex items-center justify-center rounded-full 
             border border-gray-500 
             hover:border-gray-300 hover:bg-white/5 
             transition"
        >
          <span className="text-gray-400 text-lg leading-none">⋯</span>
        </button>
        {menuOpen && (
          <div className='h-38 w-50 bg-(--menu-bg) flex flex-col gap-2 p-3 '>

            <button
              onClick={() => {
                setMenuOpen(false);
              }}
              className="flex items-center gap-4 w-full px-4 py-2 text-sm text-(--add-bg)"
            >
              <Star className="w-4 h-4  text-(--add-bg)" />
              Add to favorites
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
              }}
              className="flex items-center gap-4 w-full px-4 py-2 text-sm text-(--add-bg) "
            >
              <Archive className="w-4 h-4 text-(--add-bg)" />
              Archived
            </button>
            <hr className='h-px w-43 text-(--button-bg) '></hr>
            <button
              onClick={() => {
                setMenuOpen(false);
              }}
              className="flex items-center gap-4 w-full px-4 py-2 text-sm text-(--add-bg)"
            >
              <Trash className="w-4 h-4 text-(--add-bg)" />
              Delete
            </button>

          </div>
        )}
</div>


        <div className="flex items-center gap-25 mt-8 pb-2">
          <div className="flex items-center gap-4">
            <Calendar className="h-4 w-4 text-(--content-bg)" />
            <p
              style={{ fontFamily: 'var(--font-primary)' }}
              className="text-(--content-bg) text-sm font-semibold pl-2"
            >
              Date
            </p>
          </div>
          <p
            style={{ fontFamily: 'var(--font-primary)', fontStyle: 'var(--font-semibold)' }}
            className="text-(--add-bg) text-sm underline"
          >
            {new Date(note.createdAt).toLocaleDateString('en-GB')}
          </p>
        </div>

        <hr className="text-(--note-a-bg) w-250 h-px" />

        <div className="flex gap-20 pt-2">
          <div className="flex gap-4">
            <FolderIcon className="text-(--content-bg) h-5" />
            <p className="text-(--content-bg) text-sm">Folder</p>
          </div>
          <p
            style={{ fontFamily: 'var(--font-primary)', fontStyle: 'var(--font-semibold)' }}
            className="text-(--add-bg) text-sm underline pl-2"
          >
            {activeFolderName || 'No Folder'}
          </p>
        </div>

        <p
          style={{ fontFamily: 'var(--font-primary)', fontStyle: 'var(--font-semibold)' }}
          className="text-(--isActive-bg) text-base pt-5"
        >
          {note.content}
        </p>
      </div >
      );
};

      export default NoteDetail;


