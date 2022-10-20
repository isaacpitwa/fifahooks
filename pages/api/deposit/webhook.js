import formidable from 'formidable';
import {SSHConnection} from '../../../lib/db';

export const config = {
    api: {
      bodyParser: false
    }
}
export default  async (req, res) =>{
    const data = await new Promise((resolve, reject) => {
        const form = new formidable.IncomingForm();
        form.parse(req, (err, fields, files) => {
          if (err) reject({ err })
          resolve({ err, fields, files })
        }) 
      })
    const { address,amount,type }  = data.fields;
    console.log("Webhook received!");
    console.log("Wallet address: ",address);
    console.log ("Amount: ", amount);
    console.log("Type: ",type);

    SSHConnection.then(function(connection){
      connection.query('SELECT `id`,`address`,`status` FROM  `wallets` WHERE `address` = ? ', [address], function(err, results, fields) {
         if (err) {
            res.status(500).json({error: err, when:'Fetching Wallet'});
            console.log(err);
        } else {

            // Fetch Deposit Details
            connection.query('SELECT `id`,`user_id`, `status` FROM  `deposits` WHERE `wallet_address` = ?  AND status = ? ORDER BY `created_at` DESC', [results[0].id , 2], function(err1, results2, fields2) {
                if (err) {
                    res.status(500).json({error: err1, when: "fetching deposit details"});
                    console.log(err);
                } else{
                    res.status(200).json({status: "success", results: results1[0]});
                    console.log(results1[0]);
                }

            });
            
            console.log(fields);
        }
       });
      
    }).catch(
        (error) => {
            console.log(error);
            res.status(500).json({error});
        }
    );
    // const wallet = await db.exec('select id from wallets where address = ?', [address]);
    // console.log("Wallet id: ",wallet.rows[0].id);
    // const deposit = await db.exec('select id, user_id from deposits where wallet_address = ? and status = 2', [wallet.rows[0].id]);
    // res.status(200).json(data.fields);
}