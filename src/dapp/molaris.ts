import Moralis from 'moralis';

Moralis.start({ serverUrl: process.env.NEXT_PUBLIC_MOLARIS_SERVER_URL, appId: process.env.NEXT_PUBLIC_MOLARIS_APP_ID });

export default Moralis