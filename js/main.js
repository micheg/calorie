;(function($)
{
    var search;
    function create_db ()
    {
        var index = lunr(function ()
        {
            this.field('A', {boost: 10});
            this.ref('id');
        });
        var i=0;l=cals.length;
        for(;i<l;i++)
        {
            index.add({
                id: i,
                A: cals[i]['A']
            });
        }
        search = index;
    }

    function setup_ui ()
    {
        $('#field').on('keypress', function (event)
        {
            if ( event.charCode == 13 && window.is_mobile )
            {
                event.preventDefault();
                $('#field').blur();
                $('#cerca').trigger('click');
            }
        });

        $('#quant').on('keypress', function (event)
        {
            if ( event.charCode == 13 && window.is_mobile )
            {
                event.preventDefault();
                $('#quant').blur();
                $('#cerca').trigger('click');
            }
        });


        $(document).on('click', '#results table tr', function (evt)
        {
            evt.stopPropagation();
            evt.preventDefault();

            var template = '<p>';
                template += '<table class="table table-bordered table-striped">';
                template += '<caption>Energia e Proteine</caption>';
                template += '  <thead>';
                template += '    <tr>';
                template += '      <th>KC</th>';
                template += '      <th>KJ</th>';
                template += '      <th>Tot.</th>';
                template += '      <th>Anim.</th>';
                template += '      <th>Veg.</th>';
                template += '    </tr>';
                template += '  </thead>';
                template += '  <tbody>';
                template += '    <tr>';
                template += '        <td>$KC</td>';
                template += '        <td>$KJ</td>';
                template += '        <td>$PT</td>';
                template += '        <td>$PA</td>';
                template += '        <td>$PV</td>';
                template += '    </tr>';
                template += '  </tbody>';
                template += '</table>';
                template += '</p>';
                template += '<p>';
                template += '<table class="table table-bordered table-striped">';
                template += '<caption>Vitamine</caption>';
                template += '  <thead>';
                template += '    <tr>';
                template += '      <th>B1</th>';
                template += '      <th>B2</th>';
                template += '      <th>B3</th>';
                template += '      <th>C</th>';
                template += '      <th>B6</th>';
                template += '    </tr>';
                template += '  </thead>';
                template += '  <tbody>';
                template += '    <tr>';
                template += '        <td>$B1</td>';
                template += '        <td>$B2</td>';
                template += '        <td>$B3</td>';
                template += '        <td>$C</td>';
                template += '        <td>$B6</td>';
                template += '    </tr>';
                template += '  </tbody>';
                template += '</table>';
                template += '</p>';
                template += '<p>';
                template += '<table class="nomobile table table-bordered table-striped">';
                template += '<caption>Altro</caption>';
                template += '  <thead>';
                template += '    <tr>';
                template += '      <th>Glicidi totali</th>';
                template += '      <th>Amido</th>';
                template += '      <th>Glicidi solubili</th>';
                template += '      <th>Lipidi totali</th>';
                template += '      <th>Saturi totali</th>';
                template += '    </tr>';
                template += '  </thead>';
                template += '  <tbody>';
                template += '    <tr>';
                template += '        <td>$GT</td>';
                template += '        <td>$AM</td>';
                template += '        <td>$GL</td>';
                template += '        <td>$LT</td>';
                template += '        <td>$ST</td>';
                template += '    </tr>';
                template += '  </tbody>';
                template += '</table>';
                template += '</p>';

            var subs = ["KC","KJ","PT","PA",
                "PV","B1","B2","B3","C","B6","GT",
                "AM","GL","LT", "ST"];

            var ID = $(this).attr('ref-id');
            var JSON_DATA = cals[ID];
            var data = JSON.stringify(JSON_DATA);
            var tmp = template;

            for(var x=0; x<subs.length; x++)
            {
                tmp = tmp.replace('$' + subs[x], JSON_DATA[subs[x]]);
            }

            $T = tmp;
            bootbox.dialog({
              size: 'large',
              message: tmp,
              title: JSON_DATA['A'] + ' (per 100Gr)',
              buttons:
              {
                main:
                {
                  label: "Ok!",
                  className: "btn-primary",
                  callback: function() {}
                }
              }
            });
        });

        $(document).on('click', '#about', function (evt)
        {
            evt.stopPropagation();
            evt.preventDefault();
            bootbox.dialog({
              message: "by <a href=\"mailto:michelangelog@gmail.com\">Michelangelo Giacomelli</a>",
              title: "Ricerca cibi e calorie.",
              buttons:
              {
                main:
                {
                  label: "Ok!",
                  className: "btn-primary",
                  callback: function() {}
                }
              }
            });
        });

        $(document).on('click', '#cerca', function (evt)
        {
            evt.stopPropagation();
            evt.preventDefault();
            $('#results').hide();
            $('#res_body').empty();
            var term = $.trim($('#field').val());
            var grammi = parseInt($.trim($('#quant').val()),10);
            if(!$.isNumeric(grammi))
            {
                grammi = 100;
            }
            $('#quant').val(grammi);
            $('#kal_title').html('KC ' +  grammi + 'Gr');
            console.log("term is => " + term);
            results = search.search(term);
            //var template = "<tr><td>$A</td><td>$KCX</td><td>$KC</td><td>$KJ</td><td>$PT</td><td>$PA</td><td>$PV</td><td>$B1</td><td>$B2</td><td>$B3</td><td>$C</td><td>$B6</td></tr>";
            var template = "<tr ref-id='$ID'><td>$A</td><td>$KCX</td><td>$KC</td><td>$KJ</td><td>$PT</td><td>$PA</td><td>$PV</td></tr>";
            if ( results.length > 1 )
            {
                $('#testo').html(results.length.toString() + ' risultati trovati:');
                var l = results.length; i = 0;
                //var tmp = '';
                var cur = null;
                var subs = ["A","KCX","KC","KJ","PT","PA","PV","B1","B2","B3","C","B6"];
                //tmp = template;
                for(;i<l;i++)
                {
                    var id = results[i].ref;
                    cur = cals[results[i].ref];
                    var cur_json = JSON.stringify(cur);
                    var tmp = template;
                    for(var x=0; x<subs.length; x++)
                    {
                        if(subs[x] != 'KCX')
                        {
                            tmp = tmp.replace('$' + subs[x], cur[subs[x]]);
                        }
                        else
                        {
                            tmp = tmp.replace('$' + subs[x], ((cur['KC']/100) * grammi).toFixed(2).toString());
                        }
                    }
                    tmp = tmp.replace('$ID', id);
                    $('#res_body').append(tmp);
                }
                $('#results').show();
            }
            else
            {
                $('#testo').html('0 risultati trovati:');
            }
        });
    }

    // entry point
    $(function ()
    {
        if (isMobile.apple.phone || isMobile.android.phone || isMobile.seven_inch)
        {
            $("body").addClass('is_mobile');
            window.is_mobile = true;
        }
        console.log('entry point');
        create_db();
        setup_ui();
    });
})(jQuery);