import { AuctionRepository } from "./AuctionRepository";
import { MockAuctionRepository } from "./MockAuctionRepository";
import { FirebaseAuctionRepository } from "./FirebaseAuctionRepository";
import { isFirebaseConfigured, BACKEND_MODE, AUCTION_EVENT_ID } from "../firebase/config";

let repositoryInstance: AuctionRepository | null = null;

export function getAuctionRepository(): AuctionRepository {
  if (!repositoryInstance) {
    if (BACKEND_MODE === "firebase" && isFirebaseConfigured()) {
      repositoryInstance = new FirebaseAuctionRepository(AUCTION_EVENT_ID);
    } else {
      repositoryInstance = new MockAuctionRepository();
    }
  }
  return repositoryInstance;
}

export const auctionRepository = getAuctionRepository();
export * from "./AuctionRepository";
export { MockAuctionRepository } from "./MockAuctionRepository";
export { FirebaseAuctionRepository } from "./FirebaseAuctionRepository";
