app.controller('indexController', ['$scope', 'indexFactory', ($scope, indexFactory) => {

    $scope.messages = [];
    $scope.players = { };

    $scope.init = () => {
        const username = prompt('Please enter username');
        if(username)
            initSocket(username);
        else
            return false;
    };

    function initSocket(username) {
        indexFactory.connectSocket('http://localhost:3000', {
        reconnectionAttemts:3,
        reconnectionDelay:600,
    }).then((socket) => {
        socket.emit('newUser', {username});

        socket.on('initPlayers', (players) => {
            $scope.players = players;
            $scope.$apply();
        });

        socket.on ('newUser', (data) => {
            const messageData = {
                type: {
                    code: 0,// 0 ise server mesajı, 1 ise user mesajı
                    message: 1 //login veya disconnect mesajı
                }, 
                username: data.username,
            };
            $scope.messages.push(messageData);
            $scope.players[data.id] = data;
            $scope.$apply();
        });
        socket.on('disUser', (data) => {
            const messageData = {
                type: {
                    code: 0, // 0 ise server mesajı, 1 ise user mesajı
                    message: 0 //login veya disconnect mesajı
                }, 
                username: data.username,
            };
            $scope.messages.push(messageData);
            delete $scope.players[data.id];
            $scope.$apply();
        });

        socket.on('animate', (data) => {
            $('#' + data.socketId).animate({ 'left': data.x, 'top': data.y }, () => {
                animate= false;
            });
        });

        let animate = false;
        $scope.onClickPlayer = ($event) => {
            if (!animate){
                let x = $event.offsetX;
                let y = $event.offsetY
                socket.emit('animated', { x, y }); 

                animate= true;
                $('#' + socket.id).animate({ 'left': x, 'top': y }, () => {
                    animate= false;
                });
            }
        };
    }).catch((err) => {
        console.log(err)
    });
    }

    

}]);