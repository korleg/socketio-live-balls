app.controller('indexController', ['$scope', 'indexFactory', ($scope, indexFactory) => {

    indexFactory.connectSocket('http://localhost:3000', {
        reconnectionAttemts:3,
        reconnectionDelay:600,
    }).then((socket) => {
        console.log('Bağlantı Gerçekleşti', socket);
    }).catch((err) => {
        console.log(err)
    });

}]);