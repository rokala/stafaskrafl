import DAL from '../../core/data.access.layer';
import { today, future } from '../../utils/dates';

export default function handler(req, res) {
  if (req.query.secret !== process.env.AUTH_KEY) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  const todayDate = today();
  const futureDate = future(todayDate, parseInt(process.env.GAME_DAYS_ADVANCE));

  let currDate =  DAL.getNextAvailableStateDate() ?? todayDate;
  const datesAdded = [];
  const minSolutions = parseInt(process.env.GAME_MIN_SOLUTIONS);
  while (currDate <= futureDate) {
    const state = DAL.createRandomState(); 
    if (DAL.stateExists(state)) {
      continue;
    }
    if (DAL.getAnswerCount(state) < minSolutions) {
      continue;
    }
    datesAdded.push(currDate.toDateString());
    DAL.insertGameState(currDate, state);
    currDate.setDate(currDate.getDate() + 1);
  }
  
  const numAdded = datesAdded.length;
  let responseMessage = `Inserted ${numAdded} state${numAdded === 1 ? '' : 's'}.`;
  if (numAdded === 1) {
    responseMessage += ` For date '${datesAdded[0]}'.`;
  } else if (numAdded > 1) { 
    responseMessage += ` From date '${datesAdded[0]}' up to '${datesAdded[numAdded-1]}'.`;
  }
  res.status(200).json({ message: responseMessage });
}
