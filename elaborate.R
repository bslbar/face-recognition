# load packages
library(readr)
library(dplyr)

# load and read CSV data 
google_csv <- read.csv(file = "google-output.csv", header = TRUE, sep = ",")

ids <- google_csv %>% 
    group_by(image.name) %>%
    summarize(n())
  
ids
