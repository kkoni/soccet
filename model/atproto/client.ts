import { BskyAgent } from '@atproto/api';
import { ProfileViewDetailed } from '@atproto/api/dist/client/types/app/bsky/actor/defs';

interface Singletons {
  bskyAgent?: BskyAgent;
  actors?: Actors;
}

const singletons = {} as Singletons;

function getBskyAgent(): BskyAgent {
  if (!singletons.bskyAgent) {
    singletons.bskyAgent = new BskyAgent({ service: 'https://api.bsky.app' });
  }
  return singletons.bskyAgent;
}

export function getActors(): Actors {
  if (!singletons.actors) {
    singletons.actors = new Actors();
  }
  return singletons.actors;
}

export class Actors {
  async fetch(id: string): Promise<ProfileViewDetailed|undefined> {
    try {
      const agent = getBskyAgent();
      const response = await agent.getProfile({actor: id});
      if (response.success) {
        return response.data;
      } else {
        throw new Error('BlueSky getProfile error: unknown');
      }
    } catch(e: any) {
      if (e.status === 400 && e.message === 'Profile not found') {
        return undefined;
      } else {
        throw e;
      }
    }
  }

  async get(id: string): Promise<ProfileViewDetailed|undefined> {
    return await this.fetch(id);
  }
}
