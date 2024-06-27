const PreloadData = () => {
    return (
        <div className='px-8'>
            <div className='h-full w-full rounded-[15px] bg-white p-5 flex justify-center'>
                <div className='min-h-[81.71dvh] w-[70%] flex flex-col'>
                    <div>
                        <div className='text-2xl text-[#5955B3] font-semibold'>เพิ่มผู้ป่วยใหม่</div>
                    </div>
                    <form action="" className=" mt-2">
                        <div className='flex justify-between'>
                            <div className="w-1/2 pr-4">
                                <div className='my-2'>
                                    <span className='text-[#705396]'>ชื่อ</span>
                                    <label className="input input-bordered flex items-center gap-2 w-full">
                                        <input
                                            type="text"
                                            className="grow text-[#705396]"
                                            readOnly
                                        />
                                    </label>
                                </div>
                            </div>
                            <div className="w-1/2 pl-4">
                                <div className='my-2'>
                                    <span className='text-[#705396]'>นามสกุล</span>
                                    <label className="input input-bordered flex items-center gap-2 w-full">
                                        <input
                                            type="text"
                                            className="grow text-[#705396]"
                                            readOnly
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-between'>
                            <div className="w-1/2 pr-4">
                                <div className='my-2'>
                                    <span className='text-[#705396]'>เลขที่บัตรประจำตัวประชาชน</span>
                                    <label className="input input-bordered flex items-center gap-2 w-full">
                                        <input
                                            type="text"
                                            className="grow text-[#705396]"
                                            maxLength={13}
                                            pattern="\d{13}"
                                            readOnly
                                        />
                                    </label>
                                </div>
                            </div>
                            <div className="w-1/2 pl-4">
                                <div className='my-2'>
                                    <span className='text-[#705396]'>วันเดือนปีเกิด</span>
                                    <label className="input input-bordered flex items-center gap-2 w-full">
                                        <input
                                            type="date"
                                            className="grow text-[#705396]"
                                            readOnly
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-between'>
                            <div className="w-1/2 pr-4">
                                <div className='my-2'>
                                    <span className='text-[#705396]'>วันที่ลงทะเบียน</span>
                                    <label className=" bg-[#F8F5FB] input input-bordered flex items-center gap-2 w-full">
                                        <input
                                            type="text"
                                            className="grow pointer-events-none text-[#705396]"
                                            readOnly
                                        />
                                    </label>
                                </div>
                            </div>
                            <div className="w-1/2 pl-4">
                                <div className='my-2'>
                                    <span className='text-[#705396]'>วันนัดหมาย</span>
                                    <label className="input input-bordered flex items-center gap-2 w-full">
                                        <input
                                            type="datetime-local"
                                            className="grow text-[#705396]"
                                            readOnly
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </form>
                    <div className='flex justify-between'>
                        <div className='my-2 w-1/2 pr-4'>
                            <div className='flex'>
                                <span className='text-[#705396]'>เลือกยาที่ควรหยุดรับประทาน</span>
                            </div>
                            <div className='rounded bg-[#E8DBF5] min-h-[49dvh] p-3'>
                                <span className='text-[#705396]'> รายการที่เลือก 0 รายการ</span>
                                {/* <div className='max-h-[45dvh] overflow-y-auto'>
                                      {items.patient.med.map((medication: any, index: number) => (
                                          <div key={index} className='flex justify-between pt-2'>
                                              <select
                                                  className='w-[70%] mx-1 h-[3rem] rounded bg-[#F8F5FB] text-center text-[#705396]'
                                                  defaultValue={medication.medic}
                                                  disabled
                                              >
                                                  <option value={medication.medic}>{medication.medic}</option>
                                              </select>
                                              <select
                                                  className='w-[20%] mx-1 h-[3rem] rounded text-center text-[#705396]'
                                                  defaultValue={medication.val}
                                                  disabled
                                              >
                                                  <option value={medication.val}>{medication.val} วัน</option>
                                              </select>
                                          </div>
                                      ))}
                                  </div> */}
                            </div>
                        </div>

                        <div className="w-1/2 pl-4 flex justify-center items-center">
                            <div className='text-center w-1/2'>
                                <div className='text-[#461F78] text-3xl font-semibold my-2'>OTP</div>
                                <div className='text-[#705396] my-2'>รหัสนี้ใช้สำหรับลงทะเบียนผู้ใช้งาน Line OA</div>
                                <div className='p-10 bg-[#F8F5FB] my-2'>
                                    <span className='text-[#7F57D0] text-4xl tracking-widest'></span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default PreloadData