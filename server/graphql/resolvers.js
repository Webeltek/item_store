import config from '../config/config.js';

const resolvers = {
    Query: {
        url: (parent,args,context) =>{
          if (!context.isLogged && context.authError) {
            throw new GraphQLError(context.authError.message, { extensions: { code: 'UNAUTHENTICATED' } });
          }
          const apiUrl = config.expressApiUrl;  
          switch (args.routeId) {
            case 'image-upload':
              if(args.assetType === 'images'){
                return apiUrl+'/images/upload/';
              }
            case 'image-delete':
              if(args.assetType === 'images'){
                return apiUrl+'/images/delete/';
              }  
            default:
              throw new Error('Invalid routeId');
          }
        },
        userState: (parent,args,context) => {
          return {
            isLogged: context.isLogged
          }
        }
      }
}

export default resolvers;