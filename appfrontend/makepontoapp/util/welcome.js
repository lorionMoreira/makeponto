import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../store/auth-context';

async function myPost(url, token, data = {}) {
    try {
        const response = await axios.post(url, data, {
            headers: {
                Authorization: `${token}`  // Include the token in the Authorization header
            }
        });
        console.log("response.data");
        console.log(response.data);
        return response.data;  // Return the data directly
    } catch (error) {
        console.error('Error:', error);
        return error;  // Return error to handle it later or re-throw it
    }
}

export async function disableSomeHour(url, token) {
    let result = await myPost(url, token);
    return result;
}

export async function disableOrEnableAll(url, token) {
    let result = await myPost(url, token);
    return result;
}