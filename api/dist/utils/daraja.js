"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DarajaService = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const consumerKey = process.env.MPESA_CONSUMER_KEY;
const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
const shortCode = process.env.MPESA_SHORTCODE || '174379';
const passkey = process.env.MPESA_PASSKEY;
class DarajaService {
    static async getAccessToken() {
        const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
        const url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
        try {
            const response = await axios_1.default.get(url, {
                headers: { Authorization: `Basic ${auth}` }
            });
            return response.data.access_token;
        }
        catch (error) {
            console.error('Failed to get Daraja access token', error);
            throw new Error('Payment gateway authentication failed');
        }
    }
    static async initiateStkPush(phoneNumber, amount, accountReference) {
        const token = await this.getAccessToken();
        const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
        const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');
        const callbackUrl = process.env.MPESA_CALLBACK_URL;
        const url = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
        const data = {
            BusinessShortCode: shortCode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: amount,
            PartyA: phoneNumber,
            PartyB: shortCode,
            PhoneNumber: phoneNumber,
            CallBackURL: callbackUrl,
            AccountReference: accountReference,
            TransactionDesc: `TrueCare Payment - ${accountReference}`
        };
        try {
            const response = await axios_1.default.post(url, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        }
        catch (error) {
            console.error('STK Push Request Failed', error.response?.data || error.message);
            throw new Error('Failed to initiate STK Push');
        }
    }
}
exports.DarajaService = DarajaService;
