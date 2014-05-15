var pi = 3.1415
var twopi = pi*2

data = [];

function d3Enter() {

  arc = d3.svg.arc()
    .innerRadius(40)
    .outerRadius(45)
    .startAngle(0)
    .endAngle( function(d){ return (d.progress/100) * twopi })
  ;
    
  var diventer = d3.select('#items').selectAll('.item.dl')
    .data( data )
    .enter()
      .insert('div', ':first-child')
        .style( 'order', function(d){ return d.id } )
        .classed({'item':true,'dl':true})
        .append( 'svg' )
  ;
  
  diventer.attr( 'width', '100%' )
    .attr( 'height', '100%' )
    .attr( 'viewBox', '0 0 100 100' )
    .append( 'g' )
      .attr( 'transform', 'translate(50,50)' )
      .append( 'path' )
        .attr( 'fill', '#cb4b16' )
        .attr( 'd', arc )
  diventer.append( 'text' )
      .attr( 'text-anchor', 'middle' )
      .attr( 'dominant-baseline', 'middle' )
      .attr( 'x', '50%' )
      .attr( 'y', '50%' )
      .attr( 'font-family', 'Lato' )
      .text( function(d){ return d.id } )
  ;
  
  // diventer.append( 'div' )
    // .classed({'popup':true})
    // .attr( 'width', '400%' )
    // .attr( 'height', '100%' )
  // ;
  
  d3.select('#items').selectAll('.item')
    .data( data )      
    .exit()
      .remove()
  ;
}