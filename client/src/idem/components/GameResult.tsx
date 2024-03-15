import React from "react";
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import { MatchRankingResponse } from "../../../../common/idem/contracts/MatchRankingResponse";
import { BulletButton } from "../../components/lobby/BulletButton";

const formatNumberWithSign = (number: number): string => {
  return `${number > 0 ? '+' : ''}${number}`;
}

interface GameResultProps {
  matchRankingResponse: MatchRankingResponse;
  winningPlayerId: string;
}

export function GameResult(props: GameResultProps) {
  const { matchRankingResponse, winningPlayerId } = props;
  
  // const json = `{"players":[{"playerId":"player2","totalMatchesPlayed":2,"totalWins":0,"totalLosses":2,"season":"S1","seasonMatchesPlayed":4,"seasonWins":2,"seasonLosses":2,"matchesPlayed":2,"wins":0,"losses":2,"rating":1383,"ratingUncertainty":315.255,"rankingPoints":0,"ratingDeltaLastGame":-53,"rankingDeltaLastGame":0,"winRatio":0},{"playerId":"player2","totalMatchesPlayed":2,"totalWins":0,"totalLosses":2,"season":"S1","seasonMatchesPlayed":4,"seasonWins":1,"seasonLosses":3,"matchesPlayed":2,"wins":0,"losses":2,"rating":1383,"ratingUncertainty":315.255,"rankingPoints":0,"ratingDeltaLastGame":-53,"rankingDeltaLastGame":0,"winRatio":0}]}`;
  // const matchRankingResponse = JSON.parse(json) as MatchRankingResponse;

  const season = matchRankingResponse.players.length > 0 ? matchRankingResponse.players[0].season : 'unknown';

  return (
    <div className="bg-[url('/splash.png')] h-full flex flex-col p-1 relative">
      <div className="flex items-center justify-center mt-6 mb-3">
        <img src="bullet_mania_logo.png" alt="logo" />
      </div>
      <div
        style={{textAlign: 'center', width: '800px', margin: '40px auto',  padding: '32px', paddingTop: '16px', borderColor: 'transparent'}}
        className={`border-2 block text-center px-2`}
      >
        <h1 className={`text-3xl font-semibold uppercase text-brand-500 mt-3 mb-1`}>Game result</h1>
        <div className={'text-secondary-800'} style={{ display: 'flex', flexDirection: 'row', marginTop: '32px', fontWeight: 800, fontSize: '20px'}}>
          <div style={{ flexGrow: '1', flexShrink: '0', flexBasis: '13%', textAlign: 'left', paddingLeft: '8px'}}>
              Outcome
          </div>
          <div style={{ flexGrow: '1', flexShrink: '0', flexBasis: '16%'}}>
          </div>
          <div style={{ flexGrow: '1', flexShrink: '0', flexBasis: '20%', textAlign: 'left'}}>
              Ranking Points
          </div>
          <div style={{ flexGrow: '1', flexShrink: '0', flexBasis: '15%', textAlign: 'left'}}>
              Rating
          </div>
          <div style={{ flexGrow: '1', flexShrink: '0', flexBasis: '26%', textAlign: 'left', paddingLeft: '24px'}}>
            {`Season: ${season}`}
          </div>
        </div>
        <div className={'text-secondary-800'} style={{ display: 'flex', flexDirection: 'column', marginTop: '8px', fontSize: '20px'}}>
          {matchRankingResponse.players.map((player) => {
            const winner = player.playerId === winningPlayerId;
            const gameOutcome = winner ? 'win' : 'lose';
            const winnerBorderCss = winner ? 'border-2 border-brand-500' : '';
            const previousRank = player.rankingPoints - player.rankingDeltaLastGame;
            const rankIncreased = player.rankingDeltaLastGame > 0;
            const rankArrow = rankIncreased ? <NorthIcon sx={{ color: 'green' }} /> : <SouthIcon sx={{ color: 'red' }} />;

            return (<div key={player.playerId} className={winnerBorderCss} style={{ display: 'flex', flexDirection: 'row', borderRadius: '5px', padding: '8px', marginTop: '8px'}}>
              <div style={{ flexGrow: '1', flexShrink: '0', flexBasis: '10%', fontWeight: 600, textTransform: 'uppercase'}}>
                {gameOutcome}
              </div>
              <div style={{ flexGrow: '1', flexShrink: '0', flexBasis: '18%', fontWeight: 600}}>
                {player.playerId}
              </div>
              <div style={{ flexGrow: '1', flexShrink: '0', flexBasis: '18%'}}>
                {player.rankingPoints} {rankArrow} <span style={{fontStyle: 'italic'}}>({previousRank})</span>
              </div>
              <div style={{ flexGrow: '1', flexShrink: '0', flexBasis: '18%'}}>
                {player.rating} <span style={{fontStyle: 'italic'}}>({formatNumberWithSign(player.ratingDeltaLastGame)})</span>
              </div>
              <div style={{ flexGrow: '1', flexShrink: '0', flexBasis: '26%'}}>
                <span style={{marginRight: '16px'}}>{`${player.seasonWins} W`}</span>
                <span style={{marginRight: '16px'}}>{`${player.seasonLosses} L`}</span>
                <span style={{marginRight: '0px'}}>{`${Math.round(player.winRatio * 100)} %`}</span>
              </div>
            </div>
          )})}
        </div>
        <div style={{ width: '200px', margin: '50px auto'}}>
          <a href={"/"} className={"mt-2"}>
            <BulletButton text={"Return to home"} xlarge />
          </a>
        </div>
      </div>
    </div>
  );
}
