const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();
require("dotenv").config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);


// Register a new user
const Signup = async(req , res) => {
    try {
        const { email, password } = req.body;
  const { user } = await supabase.auth.signUp({ email, password });
    res
    .status(201)
    .json({ message: 'Signup successful', user });
    } catch (error) {
        console.error("Error in signup:", error);
        res.status(500).json({ error: "Internal server error" });    
    }
}


// Login
const Login =  async (req, res) => {
    try{

        const { email, password } = req.body;
      
        const { session } = await supabase.auth.signInWithPassword({ email, password });
        return res.status(200).json({ message: 'Login successful', session });

    }catch(error){
        console.error("Error in login:", error);
        res.status(500).json({ error: "Internal server error" });
    }

 
};

// Logout
const LogOut =  async (req, res) => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
          return res.status(400).json({ error: error.message });
        }
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error("Error in logout:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    Signup , 
    Login ,
    LogOut
};
