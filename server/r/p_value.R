args <- commandArgs(trailingOnly=TRUE)
v <- as.numeric(args);
m <- matrix(v, nrow =2, ncol =2);
p <- chisq.test(m)$p.value; 
print(p);