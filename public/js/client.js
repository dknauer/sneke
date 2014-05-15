var socket = io.connect( 'http://192.168.137.3:3000' );

$(function(){
  
  socket.emit( 'init', {} );

  $( '#additem' ).click( function() {
    socket.emit( 'add',
      {
        'url': $( '#urltext' ).val()
       ,'progress': '35'
      }
    );
  });

  $( '#delitem' ).click( function() {
    socket.emit( 'del', { 'test': true });
  });
  
  $( 'loadmore' ).click( function() {
    socket.emit( 'get', [1,100] );
  });
  
});

socket.on( 'add', function( item ){
  console.log( item );
  data.push( 
    {
      'id': item.id
     ,'url': item.url
     ,'progress': item.progress
    }
  );
  d3Enter();
});

socket.on( 'del', function( id ){
  console.log( 'del:' + id );
});

/*
socket.on( 'news', function( data ){
  console.log( data );
  socket.emit( 'event', { no1: 'cares' });
});

socket.on( 'add_row', function( row ){
  console.log( row );
  append_row( row );
});

socket.on( 'add_rows', function( rows ){
  for( var n in rows ){
    append_row( rows[n] );
  }
});

function append_row( row ){
  $( '#t' ).append(
     '<tr>'
    +'<td>'+row.id+'</td>'
    +'<td>'+row.url+'</td>'
    +'<td>'+row.status+'</td>'
    +'</tr>'
  );
}
*/