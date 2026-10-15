// Names and contacts are fictional. Teacher accounts are NOT created in this checkpoint.
const rows = [
  ['Samira Rahman','Senior Teacher','Female','Bangla','10','A','2021-01-10','Active'],
  ['Mahmud Hasan','Assistant Teacher','Male','Mathematics','9','B','2022-03-15','Active'],
  ['Tasnim Akter','Senior Teacher','Female','English','8','A','2019-06-01','Active'],
  ['Rafiqul Islam','Assistant Teacher','Male','Physics','10','B','2023-01-02','Active'],
  ['Nadia Sultana','Assistant Teacher','Female','General Science','7','C','2020-02-20','Active'],
  ['Faisal Ahmed','Senior Teacher','Male','Mathematics','6','A','2018-10-12','Active'],
  ['Sadia Karim','Assistant Teacher','Female','Information & Communication Technology','9','A','2022-08-05','Active'],
  ['Javed Hossain','Assistant Teacher','Male','Chemistry','10','C','2024-04-07','On leave'],
  ['Marium Jahan','Senior Teacher','Female','English','7','B','2019-11-22','Active'],
  ['Imran Kabir','Assistant Teacher','Male','Bangladesh & Global Studies','8','C','2021-07-18','Active'],
  ['Rukaiya Islam','Assistant Teacher','Female','Biology','9','C','2023-09-11','Active'],
  ['Sakib Chowdhury','Assistant Teacher','Male','Religion & Moral Education','6','B','2025-02-15','Inactive'],
];
const namesToIds = {'Bangla':'SUB-01','English':'SUB-02','Mathematics':'SUB-03','General Science':'SUB-04','Bangladesh & Global Studies':'SUB-05','Information & Communication Technology':'SUB-06','Religion & Moral Education':'SUB-07','Physics':'SUB-08','Chemistry':'SUB-09','Biology':'SUB-10'};
export const seedTeachers = rows.map((row,i)=>({
  id:`TCH-${String(201+i)}`,
  name:row[0],designation:row[1],gender:row[2],
  email:'',phone:'',qualification: i%2===0 ? 'B.Ed' : 'M.Ed',
  joiningDate:row[6],status:row[7],
  assignments:[{className:row[4],section:row[5],subjectId:namesToIds[row[3]]}],
}));
