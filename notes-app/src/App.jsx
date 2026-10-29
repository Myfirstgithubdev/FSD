
import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "./themecontext";
import ThemeToggle from "./themetoggle";
import NoteItem from "./noteitem";
import "./App.css";

function App() {
  const [noteText, setNoteText] = useState("");

  // Load saved notes when the app starts
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem("my-notes");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const { theme } = useContext(ThemeContext);

  // Save notes whenever they change
  useEffect(() => {
    localStorage.setItem("my-notes", JSON.stringify(notes));
  }, [notes]);

  // Update browser tab title when note count changes
  useEffect(() => {
    document.title = `Notes(${notes.length})`;
  }, [notes.length]);

  // Add a note
  const addNote = () => {
    const text = noteText.trim();

    if (!text) return;

    const newNote = {
      id: `${Date.now()}-${Math.random()}`,
      text
    };

    setNotes((previous) => [...previous, newNote]);
    setNoteText("");
  };

  // Delete a note
  const deleteNote = (id) => {
    setNotes((previous) =>
      previous.filter((note) => note.id !== id)
    );
  };

  // Add note using Enter
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      addNote();
    }
  };

  return (
    <div className={`app ${theme}`}>
      <div className="notes-container">
        <header className="app-header">
          <h1>My Notes</h1>
          <ThemeToggle />
        </header>

        <div className="note-input">
          <input
            type="text"
            placeholder="Write a note..."
            value={noteText}
            onChange={(event) => setNoteText(event.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button className="add-button" onClick={addNote}>
            Add Note
          </button>
        </div>

        <p className="note-count">
          Total notes: {notes.length}
        </p>

        {notes.length === 0 ? (
          <p className="empty-message">no notes yet</p>
        ) : (
          <ul className="notes-list">
            {notes.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                onDelete={deleteNote}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
