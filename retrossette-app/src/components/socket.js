import { io } from 'socket.io-client'

const URL = process.env.SERVER_URL;

export const SOCKET = io( URL )