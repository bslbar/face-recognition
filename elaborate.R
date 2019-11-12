# load packages
library(readr)
library(dplyr)

# load and read CSV data 
google_csv <- read.csv(file = "google-output.csv", header = TRUE, sep = ",")
azure_csv <- read.csv(file = "azure-output.csv", header = TRUE, sep = ",")

#google <- google_csv %>% 
#    group_by(image.name) %>%
#    summarize(n())

data <- merge(x = google_csv, y = azure_csv,by = c("image.name", "image.location", "image.publicUri")) %>%
    group_by(image.name)