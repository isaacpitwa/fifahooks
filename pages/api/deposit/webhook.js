import formidable from 'formidable';
import axios from 'axios';

export const config = {
    api: {
        bodyParser: false
    }
}

const makeid = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


export default async (req, res) => {
    const data = await new Promise((resolve, reject) => {
        const form = new formidable.IncomingForm();
        form.parse(req, (err, fields, files) => {
            if (err) reject({ err })
            resolve({ err, fields, files })
        })
    })
    const { address, amount, type } = data.fields;
    console.log("Webhook received!");
    console.log("Wallet address: ", address);
    console.log("Amount: ", amount);
    console.log("Type: ", type);
    if (type === "receive") {
        try {
            const response = await axios.post('https://www.basketballfundassociation.com/api/deposit/hook', 
                JSON.stringify({
                    address: address,
                    amount: amount,
                }),{headers:{"Content-Type" : "application/json"}});
            if(response.status === 200) {
                res.status(200).json({ status: "success Deposit and referrals ", results: response.data });
            } else {
                res.status(500).json({ status: "Error Updating Deposit API Response ", results: response.data });
            }

        } catch (error) {
            res.status(500).json({ status: "Error Updating Deposit Catch Error ", error: error.response.data});
        }
    } else {
        res.status(200).json({ status: "successful withdraw" });
    }
}
