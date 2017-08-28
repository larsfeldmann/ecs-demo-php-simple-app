var express = require('express');
var router = express.Router();
var faker = require('faker/locale/en_AU');
var xml = require('xml');
var dateFormat = require('dateformat');
var keyFileStorage = require("key-file-storage");
var kfs = keyFileStorage('./db', 100); // 2nd param for caching true,false,n=integer number for the latest amount of requests stored

router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/json', function(req, res) {  
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(
  	{ 
  		name: faker.name.findName(),
  		email: faker.internet.email()
  	}));
});

router.get('/AcurityWebServices/DoJob', function(req, res) {  

	if(!req.query['ElectronicFileContent']){
 		return res.status(400).send({
		   message: 'Bad request!'
		});
 	}

	var result = {};
	req.query['ElectronicFileContent'].split(':').forEach(function(x){
	    var arr = x.split('=');
	    arr[1] && (result[arr[0]] = arr[1]);
	});

	
	var reportId = result['REP'];
	//console.log('report requested = ', reportId);	

  	res.setHeader('Content-Type', 'application/xml');

  	if(reportId === 'Q615'){

		var account =  [ 
		{ 'ns0:ResponseV1' : 
			[
				{ _attr:  { 'xmlns:ns0': "http://www.qsuper.com.au/services/interface/Generic/V2"}},
				{ 'ns0:getAccountsByClientIDCustom00001Response' : 
					[		
						{ payload : 
							[								
								{ D2z_Client: firstName + ' ' + lastName}, 								
								{ account : 
									[
										{ MDz_Fund: 'QALL' },
										{ MDz_Member: '000150' },
										{ MDz_Status: 'A' }
									]
								},
								{ accountStatus: 'CURRENT' }
							]			
					}]							
				}]
			
		}];

		res.send(xml(account, { declaration: true }));

		/*
		<?xml version="1.0" encoding="UTF-8"?>
		<ns0:ResponseV1 xmlns:ns0="http://www.qsuper.com.au/services/interface/Generic/V2">
			<ns0:getAccountsByClientIDCustom00001Response xmlns:ns0="http://member.services.qsuper.com/">
				<payload>
					<D2z_Client>1000231</D2z_Client>
					<account>
						<MDz_Fund>QALL</MDz_Fund>
						<MDz_Member>000150</MDz_Member>
						<MDz_Status>A</MDz_Status>
					</account>
				</payload>
			</ns0:getAccountsByClientIDCustom00001Response>
		</ns0:ResponseV1>
		*/

	}
  	else if(reportId === 'Q677'){

		var memberId = result['US1'];

  		kfs('reports/Q677/' + memberId).then(function(member) {
		    console.log("member found!");
		    res.send(xml(member, { declaration: true }));
		}).catch(function (error) {
			return res.status(401).send({
			   message: 'member ' + memberId + ' not found!'
			});
		})

	/*
  
  		var firstName = faker.name.firstName();
  		var lastName = faker.name.lastName();
  		var title = faker.name.title();
  		var dob = faker.date.past(50, new Date());
  		console.log('dob: ', dob);

		var member =  [ 
		{ 'ns0:ResponseV1' : 
			[
				{ _attr:  { 'xmlns:ns0': "http://www.qsuper.com.au/services/interface/Generic/V2"}},
				{ 'ns0:getClientDetailsCustom00001Response' : 
					[		
						{ payload : 
							[								
								{ D2z_Client: firstName + ' ' + lastName}, 
								{ D2z_Sex: 'M'},
								{ D2z_Title: title },
								{ D2z_Address_Line_2: '' },
								{ D2z_Suburb: faker.address.city() },
								{ D2z_Post_Code: faker.address.stateAbbr() },
								{ D2c_Australian_Addr: 'Y' },
								{ D2z_Surname: lastName },
								{ D2z_Given_Names: firstName },
								{ D2z_Res_Addr_Line_1: faker.address.streetAddress() },
								{ D2z_Res_Suburb: faker.address.city() },
								{ D2z_Res_State: faker.address.stateAbbr() },
								{ D2z_Res_Post_Code: faker.address.zipCode() },
								{ D2c_Postal_Address: faker.address.stateAbbr() },
								{ D2d_Birth: dateFormat(dob.toString(), "dd/mm/yyyy")},
								{ D2d_Last_Worked:  dateFormat(faker.date.between('2010-01-01', '2017-05-31').toString(), "dd/mm/yyyy")},
								{ D2d_Eligible_Service: faker.address.stateAbbr() },
								{ D2d_Earliest_ELS: dateFormat(faker.date.past(5).toString(), "dd/mm/yyyy") },
								{ D2d_TFN_Supplied: dateFormat(faker.date.past(1).toString(), "dd/mm/yyyy") },
								{ D2d_KYC_Supplied: dateFormat(faker.date.past(2).toString(), "dd/mm/yyyy") },
								{ D2s_PreservationAge: faker.address.stateAbbr() },
								{ MDz_Group: 'AA' },
								{ InOurSystemDate: dateFormat(faker.date.between('2015-01-01', '2015-01-05').toString(), "dd/mm/yyyy") },
								{ profileIndicatorDetail : 
									[
										{ profileIndicator: 'Applicant' }	
									]
								},
								{ accountStatus: 'CURRENT' }
							]			
					}]							
				}]
			
		}];

		// write to file
		kfs['reports/Q677/' + memberId] = member;

		res.send(xml(member, { declaration: true }));
*/
	}  else {
		return res.status(401).send({
		   message: 'Report ' + reportId + ' not found!'
		});
	}

});

module.exports = router;