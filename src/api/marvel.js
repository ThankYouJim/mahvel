import axios from 'axios';
// import { setup } from 'axios-cache-adapter';
import md5 from 'md5';

const ts = new Date().getTime();
const pkey = '38b3afad36081d37a2c1e7be6389ebe4f593ead2';
const apikey = '2960e59cbe222d05e97ebb539e88937c';
const hash = md5(ts + pkey + apikey);

export default axios.create({
	baseURL: 'https://gateway.marvel.com/v1/public/',
	params: {
		apikey: apikey,
		ts: ts,
		hash: hash
	}
});