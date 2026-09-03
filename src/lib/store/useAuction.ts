"use client";

import { useEffect, useState } from "react";
import { getAuctionRepository, FullTournamentState } from "../repository";
import { Player, TeamState, Franchise, Bid, AuctionPhase } from "../../types/auction";

export function useAuction() {
  const repository = getAuctionRepository();
  const [state, setState] = useState<FullTournamentState>(() => repository.getState());

  useEffect(() => {
    // Sync state on mount
    setState(repository.getState());

    // Subscribe to state updates (whether Firebase onSnapshot or Mock)
    const unsubscribe = repository.subscribe((nextState) => {
      setState({ ...nextState });
    });

    return () => unsubscribe();
  }, [repository]);

  const currentPlayer = state.players.find((p) => p.id === state.auction.currentPlayerId);

  const leadingTeam = state.auction.leadingTeamId
    ? state.teams[state.auction.leadingTeamId]
    : undefined;

  const teamsList = Object.values(state.teams);

  return {
    state,
    auction: state.auction,
    players: state.players,
    teams: state.teams,
    teamsList,
    auditLogs: state.auditLogs,
    currentPlayer,
    leadingTeam,
    backendType: state.backendType,
    connectionStatus: state.connectionStatus,
    // Actions
    selectPlayer: (id: string) => repository.selectPlayer(id),
    startAuction: () => repository.startAuction(),
    pauseAuction: () => repository.pauseAuction(),
    resumeAuction: () => repository.resumeAuction(),
    resetTimer: (sec?: number) => repository.resetTimer(sec),
    placeBid: (teamId: string, expectedAmount?: number) => repository.placeBid(teamId, expectedAmount),
    placeManualBid: (teamId: string, amount: number) => repository.placeManualBid(teamId, amount),
    markSold: (teamId?: string, price?: number) => repository.markSold(teamId, price),
    markUnsold: () => repository.markUnsold(),
    nextPlayer: () => repository.nextPlayer(),
    prevPlayer: () => repository.prevPlayer(),
    undoLastBid: () => repository.undoLastBid(),
    reopenPlayer: (playerId: string) => repository.reopenPlayer(playerId),
    setPhase: (phase: AuctionPhase) => repository.setPhase(phase),
    setRound: (round: 1 | 2) => repository.setRound(round),
    emergencyLock: () => repository.emergencyLock(),
    resetTournament: (eventId?: string) => repository.resetTournament(eventId),
    toggleSound: () => repository.toggleSound(),
    clearOverlays: () => repository.clearOverlays(),
    exportState: () => repository.exportState(),
    importState: (jsonState: string) => repository.importState(jsonState),
  };
}

export function useTeam(teamId: string) {
  const { teams, auction, currentPlayer, placeBid } = useAuction();
  const teamState = teams[teamId];
  const isLeading = auction.leadingTeamId === teamId;

  return {
    teamState,
    isLeading,
    auction,
    currentPlayer,
    placeBid: (expectedAmount?: number) => placeBid(teamId, expectedAmount),
  };
}
