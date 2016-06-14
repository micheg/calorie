;(function($)
{
    var search;
    function create_db ()
    {
        var index = lunr(function ()
        {
            this.field('ALIMENTO', {boost: 10});
            this.ref('id');
        });
        var i=0;l=cals.length;
        for(;i<l;i++)
        {
            index.add({
                id: i,
                ALIMENTO: cals[i]['ALIMENTO']
            });
        }
        search = index;
    }

    function setup_ui ()
    {
        $(document).on('click', '#results table tr', function (evt)
        {
            evt.stopPropagation();
            evt.preventDefault();

            var template = '<p>';
                template += '<table class="table table-bordered table-striped">';
                template += '<caption>Energia e Proteine</caption>';
                template += '  <thead>';
                template += '    <tr>';
                template += '      <th>KCAL</th>';
                template += '      <th>KJ</th>';
                template += '      <th>Tot.</th>';
                template += '      <th>Anim.</th>';
                template += '      <th>Veg.</th>';
                template += '    </tr>';
                template += '  </thead>';
                template += '  <tbody>';
                template += '    <tr>';
                template += '        <td>$KCAL</td>';
                template += '        <td>$KJ</td>';
                template += '        <td>$PROT_TOT</td>';
                template += '        <td>$PROT_ANI</td>';
                template += '        <td>$PROT_VEG</td>';
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
                template += '        <td>$GLUCIDI_TOT</td>';
                template += '        <td>$AMIDO</td>';
                template += '        <td>$GLUCIDI_SOL</td>';
                template += '        <td>$LIPIDI_TOT</td>';
                template += '        <td>$SATURI_TOT</td>';
                template += '    </tr>';
                template += '  </tbody>';
                template += '</table>';
                template += '</p>';

            var subs = ["KCAL","KJ","PROT_TOT","PROT_ANI",
                "PROT_VEG","B1","B2","B3","C","B6","GLUCIDI_TOT",
                "AMIDO","GLUCIDI_SOL","LIPIDI_TOT", "SATURI_TOT"];

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
              title: JSON_DATA['ALIMENTO'] + ' (per 100Gr)',
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
            $('#kal_title').html('KCAL ' +  grammi + 'Gr');
            console.log("term is => " + term);
            results = search.search(term);
            //var template = "<tr><td>$ALIMENTO</td><td>$KCALX</td><td>$KCAL</td><td>$KJ</td><td>$PROT_TOT</td><td>$PROT_ANI</td><td>$PROT_VEG</td><td>$B1</td><td>$B2</td><td>$B3</td><td>$C</td><td>$B6</td></tr>";
            var template = "<tr ref-id='$ID'><td>$ALIMENTO</td><td>$KCALX</td><td>$KCAL</td><td>$KJ</td><td>$PROT_TOT</td><td>$PROT_ANI</td><td>$PROT_VEG</td></tr>";
            if ( results.length > 1 )
            {
                $('#testo').html(results.length.toString() + ' risultati trovati:');
                var l = results.length; i = 0;
                //var tmp = '';
                var cur = null;
                var subs = ["ALIMENTO","KCALX","KCAL","KJ","PROT_TOT","PROT_ANI","PROT_VEG","B1","B2","B3","C","B6"];
                //tmp = template;
                for(;i<l;i++)
                {
                    var id = results[i].ref;
                    cur = cals[results[i].ref];
                    var cur_json = JSON.stringify(cur);
                    var tmp = template;
                    for(var x=0; x<subs.length; x++)
                    {
                        if(subs[x] != 'KCALX')
                        {
                            tmp = tmp.replace('$' + subs[x], cur[subs[x]]);
                        }
                        else
                        {
                            tmp = tmp.replace('$' + subs[x], ((cur['KCAL']/100) * grammi).toFixed(2).toString());
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
        }
        console.log('entry point');
        create_db();
        setup_ui();
    });
})(jQuery);