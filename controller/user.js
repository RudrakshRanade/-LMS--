const User = require("../model/User");

exports.update_user = async(req , res) => {

try{
            
const { firstName , lastName } = req.body;
const user_id = req.user.id;

console.log(user_id);

if( !firstName || !lastName ){
return res.status(404).json({
    success:false,
    message:"All fields are required"  })
}

const response = await User.findByIdAndUpdate(
user_id,
{
  firstName: firstName,
  lastName: lastName
},
{ new: true } // This option returns the updated document
);

console.log(response);

if( !response ){
return res.status(404).json({
    success:false,
    message:"Not able to update profile. Please try again"
})
}

console.log("hello");

    
return res.status(200).json({
success: true,
message: 'user updated successfully'  });

}

catch( error ){
    return res.status(500).json({
        success:false,
        message:"Could not update your profile!",
    })
}

}


exports.getFine = async( req , res ) => {

try{

const user_id = req.user.id;

const user_details = await User.findById(user_id);
    
if( !user_details ){
return res.status(404).json({
    success:false,
    message:"User does not exist"  })
}
 
const data = user_details.fine;

return res.status(200).json({
    success : true,
    data,
    message : "Fine calcutated successfully"  })

}

catch(error){
return res.status(500).json({
    success:false,
    message:"Cannot fetch fine currently"
})

}

} 