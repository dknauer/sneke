var express = require( 'express' )
var app     = express();
var server  = require( 'http' ).createServer( app );
var io      = require( 'socket.io' ).listen( server );
var logger  = require( 'morgan' );
var path    = require( 'path' );
var redis   = require( 'redis' );
var async   = require( 'async' );

app.set( 'views', path.join( __dirname, 'views' ));
app.set( 'view engine', 'jade' );
app.use( logger( 'dev' ));
app.use( require( 'stylus' ).middleware( path.join( __dirname, 'public' )));
app.use( express.static( path.join( __dirname, 'public' )));

server.listen( 3000 );

app.get( '/', function( req, res ){
  res.render( 'index' , {} );
});

io.sockets.on( 'connection', function( socket ){
  var sub = redis.createClient();
  var db = redis.createClient();
  
  function fetch_item( item, next ){
    db.hgetall( 'url:'+item, function( err, result ){
      next( err, result );
    });
  }
  
  socket.on( 'click', function( data ){
    db.incr( 'url_id', function( err, newid ){
      db.multi()
        .lpush( 'url_index', newid )
        .hset( 'url:'+newid, 'url', data )
        .hset( 'url:'+newid, 'id', newid )
        .hset( 'url:'+newid, 'status','new' )
        .publish( 'url-notify', 'add '+newid )
        .exec()
    });
  });
  
  socket.on( 'loadall', function( data ){
    console.log( 'got loadall' );
    db.lrange( 'url_index', 1, 100, function( err, ids ){
      async.map( ids, fetch_item, function( err, results ){
        if(err){
          console.log(err);
        } else {
          console.log( 'emitting results' );
          socket.emit( 'add_rows', results );
        }
      });
    });
  });
  
  sub.on( 'message', function( channel, message ){
    console.log(message);
    if( message.split(' ')[0] = 'add' ){
      db.hgetall( 'url:'+message.split(' ')[1], function( err, res ){
        socket.emit( 'add_row',
          {
            'id':     res.id
           ,'url':    res.url
           ,'status': res.status
          }
        );
      });
    }  
  });
  
  sub.subscribe( 'url-notify' );
  socket.on( 'disconnect', function(){
    sub.unsubscribe( 'test-channel' );
  });
  
});