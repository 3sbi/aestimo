import type { Session } from '$lib/types';
import { sessionsService } from '.';

class SessionService {
	findById(id: Session['id']): Session {
		return sessionsService.findById(id);
	}
}

const sessionService = new SessionService();
export default sessionService;
