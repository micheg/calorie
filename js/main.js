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
        $(document).on('click', '#about', function (evt)
        {
            evt.stopPropagation();
            evt.preventDefault();
            bootbox.dialog({
              message: "by <a href=\"mailto:michelangelog@gmail.com\">Michelangelo Giacomelli</a>",
              title: "Ricerca cibi e calorie. About",
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
            var template = "<tr><td>$ALIMENTO</td><td>$KCALX</td><td>$KCAL</td><td>$KJ</td><td>$PROT_TOT</td><td>$PROT_ANI</td><td>$PROT_VEG</td><td>$B1</td><td>$B2</td><td>$B3</td><td>$C</td><td>$B6</td></tr>";
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
                    cur = cals[results[i].ref];
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
        console.log('entry point');
        create_db();
        setup_ui();
    });
})(jQuery);