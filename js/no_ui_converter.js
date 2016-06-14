var $F = ["KC","KJ","PT","PA","PV","B1","B2","B3","C","B6","GT","AM","GL","LT", "ST", 'A'];
var tmp = [];
var obj = null;
$(cals).each(function (i,v)
{
    obj = {};
    $($F).each(function (x,field)
    {
        obj[field] = v[field];
    });
    tmp.push(obj);
    obj = null;
});