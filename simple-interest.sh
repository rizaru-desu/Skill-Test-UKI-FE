#!/bin/bash
# Script to calculate simple interest based on user input

echo "---------------------------------------"
echo "        Simple Interest Calculator      "
echo "---------------------------------------"

# Input Principal amount
read -p "Enter the principal amount: " p

# Input Annual rate of interest
read -p "Enter the annual rate of interest (in %): " r

# Input Time period in years
read -p "Enter the time period (in years): " t

# Formula: Simple Interest = (P * R * T) / 100
# Menggunakan 'bc' untuk mendukung perhitungan desimal
interest=$(echo "scale=2; ($p * $r * $t) / 100" | bc)
total=$(echo "scale=2; $p +$interest" | bc)

echo "---------------------------------------"
echo "Simple Interest: $interest"
echo "Total Amount (Principal + Interest):
