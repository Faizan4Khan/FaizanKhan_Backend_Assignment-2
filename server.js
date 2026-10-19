import express from "express";

const app = express();
const PORT = 5000;

app.use(express.json());

const notes = [];
let nextId = 1;

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Notes API is running",
    endpoints: {
      notes: "/notes",
      noteById: "/notes/:id",
    },
  });
});

app.get("/notes", (req, res) => {
  res.status(200).json(notes);
});

app.post("/notes", (req, res) => {
  const { title, content } = req.body ?? {};

  if (
    typeof title !== "string" ||
    title.trim() === "" ||
    typeof content !== "string" ||
    content.trim() === ""
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newNote = {
    id: nextId,
    title,
    content,
    createdAt: new Date().toISOString().slice(0, 10),
  };

  nextId += 1;
  notes.push(newNote);

  return res.status(201).json(newNote);
});

app.get("/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const note = notes.find((item) => item.id === id);

  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  return res.status(200).json(note);
});

app.put("/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const note = notes.find((item) => item.id === id);

  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  const { title, content } = req.body ?? {};

  if (
    typeof title !== "string" ||
    title.trim() === "" ||
    typeof content !== "string" ||
    content.trim() === ""
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  note.title = title;
  note.content = content;

  return res.status(200).json(note);
});

app.delete("/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const noteIndex = notes.findIndex((item) => item.id === id);

  if (noteIndex === -1) {
    return res.status(404).json({ message: "Note not found" });
  }

  notes.splice(noteIndex, 1);

  return res.status(200).json({ message: "Note deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Notes API is running at http://localhost:${PORT}`);
});
