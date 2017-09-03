var express = require('express');
var router = express.Router();
var keyFileStorage = require("key-file-storage");
var kfs = keyFileStorage('./db', false); 
var faker = require('faker/locale/en_AU');
var xml = require('xml');
var dateFormat = require('dateformat');

/* GET users listing. */
router.get('/', function(req, res) {
	console.log('entered test route');
  	res.send('respond with a test');
});

router.post('/', function(req, res) {

	console.log('adding test data');

	var numberOfTestMembers = 50
	var memberIds = [];

	if(req.query['number']){ 		
 		numberOfTestMembers = req.query['number']; 		
 	}

 	console.log('Generating ', numberOfTestMembers, ' new members');

	var gender = ['M', 'F'];

	for (var i = 0; i < numberOfTestMembers; i++) {

  		var memberId = faker.random.number({min:11111111, max:99999999});
  		var firstName = faker.name.firstName();
  		var lastName = faker.name.lastName();
  		var title = faker.name.title();
  		var dob = faker.date.past(50, new Date());

  		memberIds.push(memberId);

		var member =  [ 
		{ 'ns0:ResponseV1' : 
			[
				{ _attr:  { 'xmlns:ns0': "http://www.qsuper.com.au/services/interface/Generic/V2"}},
				{ 'ns0:getClientDetailsCustom00001Response' : 
					[		
						{ payload : 
							[								
								{ D2z_Client: memberId}, 
								{ D2z_Sex: faker.helpers.randomize(gender)},
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

		kfs['reports/Q677/' + memberId] = member;
	}

	console.log(memberIds);

	res.setHeader('Content-Type', 'text/csv');
  	res.send(memberIds);
});

module.exports = router;
