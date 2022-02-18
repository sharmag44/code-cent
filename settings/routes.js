'use strict';
const apiRoutes = require('../helpers/apiRoute');
var auth = require('../middlewares/authorization');

module.exports.configure = (app) => {
     app.get('/', (req, res) => {
          res.render('index', {
               title: 'Makecents API',
          });
     });
     app.get('/api', (req, res) => {
          res.render('index', {
               title: 'Makecents API',
          });
     });

     let api = apiRoutes(app);

     api.model('teachers').register([
          {
               action: 'POST',
               method: 'signup',
               url: '/signup',
          },
          {
               action: 'GET',
               method: 'verify',
               url: '/verify/:teacherId',
          },
          {
               action: 'DELETE',
               method: 'delete',
               url: '/delete/:id',
          },
          {
               action: 'POST',
               method: 'searchOne',
               url: '/searchOne',
          },
          {
               action: 'POST',
               method: 'signin',
               url: '/signin',
          },
          {
               action: 'POST',
               method: 'forgotpassword',
               url: '/forgotpassword',
          },
          {
               action: 'POST',
               method: 'findmyid',
               url: '/findmyid',
          },
          {
               action: 'GET',
               method: 'findAll',
               url: '/findAll',
          },
     ]);

     api.model('persons').register([
          {
               action: 'POST',
               method: 'create',
               url: '/create',
          },
          {
               action: 'GET',
               method: 'delete',
               url: '/delete/:id',
          },
     ]);

     api.model('songs').register([
          {
               action: 'POST',
               method: 'create',
          },
          {
               action: 'PUT',
               method: 'update',
               url: '/:id',
          },

          {
               action: 'GET',
               method: 'get',
               url: '/:id',
          },
          {
               action: 'DELETE',
               method: 'delete',
               url: '/:id',
          },
          ,
          {
               action: 'GET',
               method: 'search',
          },
     ]);

     api.model('likes').register([
          {
               action: 'POST',
               method: 'like',
               url: '/like',
          },
          {
               action: 'GET',
               method: 'showList',
               url: '/showList',
          },
     ]);

     api.model('orders').register([
          {
               action: 'POST',
               method: 'create',
               url: '/create',
          },
          {
               action: 'DELETE',
               method: 'delete',
               url: '/delete/:order_id',
          },
          {
               action: 'GET',
               method: 'findAll',
               url: '/findAll',
          },
          {
               action: 'GET',
               method: 'find',
               url: '/find/:order_id',
          },
     ]);

     api.model('users').register([
          {
               action: 'POST',
               method: 'signUp',
               url: '/signup',
          },
          {
               action: 'POST',
               method: 'signin',
               url: '/signin',
          },
          {
               action: 'POST',
               method: 'forgotPassword',
               url: '/forgotPassword',
          },
          {
               action: 'PUT',
               method: 'updatePassword',
               url: '/updatePassword/:id',
          },
          {
               action: 'PUT',
               method: 'update',
               url: '/:id',
               filter: auth.requiresToken,
          },
          {
               action: 'GET',
               method: 'get',
               url: '/:id',
               filter: auth.requiresToken,
          },
          {
               action: 'GET',
               method: 'search',
               filter: auth.requiresToken,
          },
          {
               action: 'DELETE',
               method: 'delete',
               url: '/:id',
               filter: auth.requiresToken,
          },
          {
               action: 'POST',
               method: 'verification',
               url: '/verify',
          },
          {
               action: 'POST',
               method: 'resend',
               url: '/resend',
          },
     ]);
};
