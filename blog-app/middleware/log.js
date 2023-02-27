module.exports = (err, req, res, next)=>{
    console.log("log" + err.message);    //Loglama ucun => winstondan istifade etmekde olar
    next(err);
}