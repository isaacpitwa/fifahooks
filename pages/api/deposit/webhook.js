import formidable from 'formidable';
import {SSHConnection} from '../../../lib/db';

export const config = {
    api: {
      bodyParser: false
    }
}

const  makeid = (length)  =>{
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
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
      if(type === "receive"){
        SSHConnection.then(function(connection){
            connection.query('SELECT `id`,`address`,`status` FROM  `wallets` WHERE `address` = ? ', [address], function(err, results, fields) {
               if (err) {
                  res.status(500).json({error: err, when:'Fetching Wallet'});
                  console.log(err);
              } else {
                  console.log("Wallet found: ",results[0]);
                  // Fetch Deposit Details
                  connection.query('SELECT `id`,`user_id`, `final_amo`, `status` FROM  `deposits` WHERE `wallet_address` = ?  AND status = ? ORDER BY `created_at` DESC', [results[0].id , 2], function(err1, results2, fields2) {
                      if (err) {
                          res.status(500).json({error: err1, when: "fetching deposit details"});
                          console.log(err);
                      } else{
                          connection.query('UPDATE `users` SET `balance` = `balance` + ? WHERE `id` = ?', [(amount * 1.1), results2[0].user_id], function(err2, results3, fields3) {
      
                              if (err2) {
                                  res.status(500).json({error: err2, when: "Updating  Users Balance"});
                                  console.log(err);
                              } else {
                                  connection.query('UPDATE `wallets` SET `status` = ? WHERE `id` = ?', [0, results[0].id], function(err5, results5, fields5) {
      
                                      if (err5) {
                                          console.log({error: err5, when: "Updating  Wallet Status"});
                                      } else {
                                          console.log('Successfully Released wallet');
                                      }
                                  });
      
                                  connection.query('UPDATE `deposits` SET `status` = ? WHERE `id` = ?', [1, results2[0].id], function(err3, results4, fields4) {
      
                                      if (err3) {
                                          res.status(500).json({error: err3, when: "Updating  Deposit"});
                                          console.log(err);
                                      } else {
                                        connection.query('INSERT INTO `transactions` (user_id,charge,trx_type,details,trx,amount,post_balance)  VALUES ? ', [ 
                                            [results2[0].user_id,0,'+','Deposit',makeid(12),amount,(results2[0].balance+amount)],
                                            [results2[0].user_id,0,'+','Recharge Bonus',makeid(12),(amount * 0.1),(results2[0].balance+(amount * 1.1))],
                                          ], function(err4, results5, fields5) {

                                            if (err4) {
                                                res.status(500).json({error: err4, when: "Creating Trasaction records"});
                                                console.log(err4);
                                            } else {
                                                res.status(200).json({status: "success Updating  Deposit And User Balance And Tranaction records ", results: results4[0]});
                                            }
                                        });
                                      }
                                  });
      
      
                              }
                          });
      
                          console.log('Deposit Details',results2[0]);
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
      }
}