var pi = 3.1415
var twopi = pi*2

var data = [
  {'id':'1','url':'example.com','status':'completed','progress':'100'}
 ,{'id':'2','url':'example.com','status':'completed','progress':'70'}
 ,{'id':'3','url':'example.com','status':'completed','progress':'20'}
 ,{'id':'4','url':'example.com','status':'completed','progress':'60'}
 ,{'id':'2','url':'example.com','status':'completed','progress':'70'}
 ,{'id':'3','url':'example.com','status':'completed','progress':'20'}
 ,{'id':'4','url':'example.com','status':'completed','progress':'60'}
 ,{'id':'2','url':'example.com','status':'completed','progress':'70'}
 ,{'id':'3','url':'example.com','status':'completed','progress':'20'}
 ,{'id':'4','url':'example.com','status':'completed','progress':'60'}
 ,{'id':'2','url':'example.com','status':'completed','progress':'70'}
 ,{'id':'3','url':'example.com','status':'completed','progress':'20'}
 ,{'id':'4','url':'example.com','status':'completed','progress':'60'}
];

var nextid = 5

$( function(){    
  d3Enter();
  $( '#additem' ).click( function(){
    data.push({'id':nextid++,'url':'example.com','status':'completed'});
    d3Enter();
  });
  $( '#delitem' ).click( function(){
    data.pop();
    console.log(data);
    d3Enter();
  });
});

function d3Enter() {
  arc = d3.svg.arc()
    .innerRadius(40)
    .outerRadius(45)
    .startAngle(0)
    .endAngle( function(d){ return (d.progress/100) * twopi })
  ;
    
  var diventer = d3.select('#content').selectAll('.item.dl')
    .data( data )
    .enter()
      .append('div')
        .classed({'item':true,'dl':true})
  ;
  
  diventer.append( 'svg' )
    .attr( 'width', '100%' )
    .attr( 'height', '100%' )
    .attr( 'viewBox', '0 0 100 100' )
    .append( 'g' )
      .attr( 'transform', 'translate(50,50)' )
      .append( 'path' )
        .attr( 'fill', '#dc322f' )
        .attr( 'd', arc)  
  ;
  
  diventer.append( 'div' )
    .classed({'popup':true})
    .attr( 'width', '400%' )
    .attr( 'height', '100%' )
    .text( 'some shit' )
  ;
  
  d3.select('#content').selectAll('.item')
    .data( data )      
    .exit()
      .remove()
  ;
}