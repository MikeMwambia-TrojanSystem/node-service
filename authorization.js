// middleware for doing role-based permissions

let permittedRoles = function (){

  roles = {
    admin : 'admin',
    staff : 'staff',
    owner : 'employee',
    owner : 'owner',
    user : 'user',
    public : 'public'
  }
  return {
    permittedRoles : roles
  }
}


export default function permit(...permittedRoles) {
    console.log('Authorization present')
    // return a middleware
    return (request, response, next) => {
      const { user } = request
  
      if (user && permittedRoles.includes(user.role)) {
        next(); // role is allowed, so continue on the next middleware
      } else {
        response.status(403).json({message: "Forbidden"}); // user is forbidden
      }
    }
}