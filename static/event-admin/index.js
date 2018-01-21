
  $.getJSON('getevents/search', function(data) {
    var colleges = data

    var mySelect = $('#mySelect');
    $.each(colleges, function(val, text) {
      mySelect.append(
        $('<option></option>').val(val).html(text)
        );
    });

  })

  var removeRows = function() {
    $('#table tr').each( function(index){
      var classes = $(this).attr('class') ;
      console.log(classes);
      if( classes != 'invisible' && classes != 'header') {
          // console.log(classes , 'Success');
          $(this).remove();
        }
      });

  }

  var addnewEvent = function() {
    removeRows();
    $('#college_selected').val('') ;
    $('#college_name_selected').val('');
    $('#add-new-text').removeClass('invisible');
  }

  var $TABLE = $('#table');
  var $BTN = $('#export-btn');
  var $EXPORT = $('#export');



  $('#get-data').click(function () {

    console.log('Clicked');
    var value = $('#mySelect').val() ;
    var value_text = $("#mySelect option:selected").text();
    if (value == 'addnew') {
      addnewEvent();
      return;
    }
    $('#add-new-text').addClass('invisible');

    $('#college_selected').val(value) ;
    $('#college_name_selected').val(value_text);

    var url = "getevents/" + value ;
    console.log(url)
    $.getJSON( url , function( data ) {
      var items = [];
      // if( !data.success ){
      //   alert('Error');
      //   return ;
      // }
      removeRows();
      $.each( data.events, function( index, val ) {
        var $clone = $TABLE.find('tr.invisible').clone(true)
        var children = $clone.children() ;
        // console.log(children)
        // children.eq(0).text(val.url);
        var start = new Date(parseInt(val.start));
        // console.log(start)
        var formattedDate = moment(start).format('YYYY-MM-DD HH:MM:SS');
        children.eq(0).text(formattedDate);
        
        var end = new Date(parseInt(val.end));
        var formattedDate = moment(end).format('YYYY-MM-DD HH:MM:SS');
        children.eq(1).text(formattedDate);
        // children.eq(2).text(val.end)
        children.eq(2).text(val.title);
        children.eq(3).text(val.class);
        children.eq(4).text(val.description);

        $clone.removeClass('invisible table-line')
        $TABLE.find('table').append($clone);
      });

    });

  });

  $('.table-add').click(function () {
    var $clone = $TABLE.find('tr.invisible').clone(true).removeClass('invisible table-line');
    $TABLE.find('table').append($clone);
  });

  $('.table-remove').click(function () {
    $(this).parents('tr').detach();
  });

  $('.table-up').click(function () {
    var $row = $(this).parents('tr');
    if ($row.index() === 1) return; // Don't go above the header
    $row.prev().before($row.get(0));
  });

  $('.table-down').click(function () {
    var $row = $(this).parents('tr');
    $row.next().after($row.get(0));
  });

  // A few jQuery helpers for exporting only
  jQuery.fn.pop = [].pop;
  jQuery.fn.shift = [].shift;

  $BTN.click(function () {
    var $rows = $TABLE.find('tr:not(:hidden)');
    var headers = [];
    var data = [];
    
    // Get the headers (add special header logic here)
    $($rows.shift()).find('th:not(:empty)').each(function () {
      headers.push($(this).text().toLowerCase());
    });
    
    // Turn all existing rows into a loopable array
    $rows.each(function () {
      var $td = $(this).find('td');
      var h = {};
      
      // Use the headers from earlier to name our hash keys
      headers.forEach(function (header, i) {
        h[header] = $td.eq(i).text();   
      });
      
      data.push(h);
    });

    data.forEach(function(item) {
      item.start = new Date(item.start).getTime() ;
      item.end =  new Date(item.end).getTime() ;
      console.log(item);
    })
    
    // Output the result
    // $EXPORT.text(JSON.stringify(data , null , indent=4));
    console.log(data);

    var college = $('#college_selected').val()
    var college_name = $('#college_name_selected').val()

    if (college == '' || college_name == '') {
      alert('College Name or ID Cant Be Empty');
      return;
    }

    var payload = {
      'college' : $('#college_selected').val() ,
      'college_name' : $('#college_name_selected').val() ,
      'events' : data 
    };


    $.post( "events-admin", payload)
    .done(function(res) {
      $EXPORT.text(JSON.stringify(res , null , indent=4));
    }) ;

  });
