var express   = require( 'express' )
var app       = express();
var server    = require( 'http' ).createServer( app );
var io        = require( 'socket.io' ).listen( server );
var logger    = require( 'morgan' );
var path      = require( 'path' );
var redis     = require( 'redis' );
var async     = require( 'async' );
//var dbutil    = require( './dbutil.js' );

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
  
  // connect to redis
  var sub = redis.createClient();
  var db  = redis.createClient();
  
  // subscribe to notify channel
  sub.subscribe( 'url-notify' );
  socket.on( 'disconnect', function(){
    sub.unsubscribe( 'url-notify' );
  });
  
  // push inital items to client
  getItems( db, 0, 20, function( err, results ){
    async.each( results, function( item, next ){
      socket.emit( 'add', item );
      next();
    });
  });
  
  // incoming subscriptions
  sub.on( 'message', function( channel, message ){
    console.log( 'pub: '+message );
    var type = message.split(' ')[0];
    var id   = message.split(' ')[1];
    if( type == 'add' ){
      getItem( db, id, function( err, item ){
        console.log('got: ', item);
        socket.emit( 'add', item );
      });
    }
  });
  
  // incoming socket messages
  socket.on( 'add', function( data ){
    addItem( db, data, function(){
      console.log( 'add' );
    });
  });
  
  socket.on( 'del', function( id ){
    delItem( db, id, function(){
      console.log( 'del' );
    });
  });
  
});


//inlining utility fns until I figure out modules...
function addItem( db, data, next ){
  db.incr( 'newid', function( err, newid ){
    db.multi()
      .lpush( 'urls', newid )
      .hmset( 'url:'+newid, 
        {
          'id': newid
         ,'url': data.url
         ,'status': 'new'
         ,'progress': data.progress
        })
      .publish( 'url-notify', 'add '+newid )
      .exec( next )
    ;
  });
}

function delItem( db, id, next ){
  db.multi()
    .del( 'url:'+id )
    .lrem( 'urls', 0, id )
    .publish( 'url-notify', 'del '+id )
    .exec( next )
  ;
}

function getItem( db, id, next ){
  db.hgetall( 'url:'+id, next )
}

function getItems( db, start, count, next ){
  db.lrange( 'urls', start, start+count, function( err, result ){
    if(err){
      next(err);
    } else {
      async.map( 
        result
       ,function( id, mapnext ){ getItem( db, id, mapnext ) }
       ,next
      );
    }
  });
}