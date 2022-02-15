const ExpenseBook = require('../models/ExpenseBook');

exports.getExpenseBook = async (req, res) => {
  const expenseBook = await ExpenseBook.findOne({ userRef: req.user._id });
  
  if (expenseBook) {
    res.status(200).json(expenseBook.entries)  
  } else {
    res.status(400).json({err: 'No expense book was found under the requested user id'})
  }
}

exports.saveEntries = async (req, res) => {
  const entries = req.body
  console.log(req.body)
  
  //Sanitize, validate, then...
  const expenseBook = await ExpenseBook.findOne({ userRef: req.user._id });

  if (expenseBook) {
    expenseBook.entries = expenseBook.entries.concat(entries)
    console.log(expenseBook.entries)

    const expenseBook_ = await expenseBook.save()

    res.status(200).json( expenseBook.entries.length )
  } else {
    const toSave = {
      userRef: req.user._id,
      entries: entries,
    }
    console.log(toSave)
    const newExpenseBook = new ExpenseBook({ ...toSave })
    const expenseBook_ = await newExpenseBook.save();

    res.status(200).json( toSave.entries.length )  
  }
}

exports.deleteEntry = async (req, res) => {
  const { _id } = req.body

  const expenseBook = await ExpenseBook.findOne({ userRef: req.user._id });

  if (expenseBook) {
    expenseBook.entries = expenseBook.entries.filter((item) => item.id !== _id)

    const expenseBook_ = await expenseBook.save()
    res.status(200).json( expenseBook.entries.length )
  } else {
    res.status(400).json("No expense book was found.")  
  }
}

