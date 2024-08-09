export const requestHandler=(asyncHandler)=>{
  return(req,res,next)=>{
    Promise.resolve(asyncHandler(req,res,next)).catch((error)=>next(error))
  }
}