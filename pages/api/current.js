import DAL from '../../core/data.access.layer';


export default function handler(req, res) {
  // TODO: Cache this response for key date.
  const current = DAL.getCurrent();
  if (!current) {
    // TODO: Create needed state on demand.
    res.status(400).json({ message: `No game state found for current date.` })
  }
  res.status(200).json(current);
}
