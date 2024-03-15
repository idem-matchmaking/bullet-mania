import axios, { AxiosRequestConfig } from 'axios';
import { MatchRankingRequest } from './contracts/MatchRankingRequest';
import { MatchRankingResponse } from './contracts/MatchRankingResponse';

export type IdemHttpClientOptions = {
    apiUrl: string;
    authUrl: string;
    authClientId: string;
    authUsername: string;
    authPassword: string;
}

export class IdemHttpClient {
    private readonly options: IdemHttpClientOptions;
    
    constructor(options: IdemHttpClientOptions) {
        this.options = options;
    }

    async confirmMatch(gameId: string, matchId: string): Promise<void> {
        try {
            const config = await this.getApiRequestConfig();
            const endpoint = `${this.options.apiUrl}/games/${gameId}/matches/${matchId}/statuses/confirmed`;
            await axios.post(endpoint, {}, config);
        } catch (e) {
            console.log(`confirmMatch error: ${e}`);
            throw e;
        }
    }

    async completeMatch(gameId: string, matchId: string, body: MatchRankingRequest): Promise<MatchRankingResponse> {
        try {
            const config = await this.getApiRequestConfig();
            const data = JSON.stringify(body);
            const endpoint = `${this.options.apiUrl}/games/${gameId}/matches/${matchId}/statuses/completed`;
            const response = await axios.post(endpoint, data, config);
            console.log(JSON.stringify(response.data));
            return response.data as MatchRankingResponse;
        } catch (e) {
            console.log(`completeMatch error: ${e}`);
            throw e;
        }
    }

    private async getApiRequestConfig(): Promise<AxiosRequestConfig> {
        return {
            headers: {
                'Authorization': await this.getAuthToken(),
            }
        };
    }

    private async getAuthToken(): Promise<string> {
        try {
            const data = {
                AuthParameters: {
                    USERNAME: this.options.authUsername,
                    PASSWORD: this.options.authPassword
                },
                AuthFlow: 'USER_PASSWORD_AUTH',
                ClientId: this.options.authClientId
            };
            const config: AxiosRequestConfig = {
                headers: {
                    'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
                    'Content-Type': 'application/x-amz-json-1.1'
                }
            };
            const response = await axios.post(this.options.authUrl, JSON.stringify(data), config);
            return response.data.AuthenticationResult.IdToken;
        } catch (e) {
            console.log(`getAuthToken error: ${e}`);
            throw e;
        }
    }
}